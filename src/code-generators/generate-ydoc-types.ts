import {
    parse,
    visit,
    Kind,
    TypeNode,
    StringValueNode,
    ValueNode
} from 'graphql';
import { Project, ScriptKind } from 'ts-morph';

export interface GraphQLToTSTypeInput {
    type: string;
    isArray?: boolean;
    isReference?: boolean;
}

// export type DirectiveMap = Record<string, Array<{key: string, value: string}>>
export type ConstNodeValue = string | number | boolean | undefined | string[] | number[] | boolean[]
export type DirectiveMap = Record<string, any>

export type EntityInfo = {
    fields: Record<string, FieldInfo>;
    isSyncable: boolean;
    isRecord: boolean;
    isRecordEvent: boolean;
    directives: DirectiveMap;
    entityName: string;
}

export type LocalDependency = Record<string, {
    fileName: string,
    namedExports: string[],
}>

export type FieldInfo = {
    // entity
    entityName: string;
    fieldName: string;
    fieldType: string;
    to?: string;
    isScalar: boolean;
    isList: boolean;
    isRelation: boolean;
    isRecord: boolean;
    isRecordEventArray: boolean;
    directives: DirectiveMap;
    isSyncable: boolean;
    isDerived: boolean;
    isEnum: boolean;
    isRequired: boolean;
    isLifeCycleEventArray: boolean;
    filter?: any;
    orderBy?: any;
}

function parseValueNode(valueNode: ValueNode): any {
    switch (valueNode.kind) {
        case 'StringValue':
        case 'BooleanValue':
            return valueNode.value;

        case 'IntValue':
            return parseInt(valueNode.value, 10);

        case 'FloatValue':
            return parseFloat(valueNode.value);

        case 'NullValue':
            return null;

        case 'EnumValue':
            return valueNode.value;

        case 'ListValue':
            return valueNode.values.map(parseValueNode);

        case 'ObjectValue':
            return valueNode.fields.reduce((obj, field) => {
                obj[field.name.value] = parseValueNode(field.value);
                return obj;
            }, {} as Record<string, any>);

        default:
            return null;
    }
}

const graphqlToTSType = ({ isEnum, fieldType, isList, isRelation }: FieldInfo) => {
    const suffix = isList ? '[]' : '';
    if (isRelation && isList) {
        return `Reference<string[]>`
    } else if (isRelation) {
        return 'Reference<string>'
    }

    if (isEnum) {
        return `${fieldType}${suffix}`;
    }

    switch (fieldType) {
        case 'Int':
        case 'Float':
            return `number${suffix}`;
        case 'Time':
            return 'string';
        case 'DateTime':
            return 'string';
        case 'String':
        case 'ID':
            return `string${suffix}`;
        case 'Boolean':
            return `boolean${suffix}`;
        default:
            return `YDoc${fieldType}${suffix}`; // Default for custom types
    }
};

// todo: get these from the schema document
const SCALAR_TYPES = new Set([
    'Int',
    'Float',
    'String',
    'Boolean',
    'ID',
    'Time',
    'DateTime'
]);

function getTypeName(typeNode: TypeNode): string {
    if (typeNode.kind === Kind.NON_NULL_TYPE) {
        return `${getTypeName(typeNode.type)}!`;
    }
    if (typeNode.kind === Kind.LIST_TYPE) {
        return `[${getTypeName(typeNode.type)}]`;
    }
    if (typeNode.kind === Kind.NAMED_TYPE) {
        return typeNode.name.value;
    }
    return "Unknown";
}
export const createYDocFromSchema = async (schema: string, outputDir?: string): Promise<Project> => {
    const graphqlAst = parse(schema);

    const scalars: string[] = []
    const enums: string[] = []
    const inputs: any[] = []
    const fields: FieldInfo[] = []
    const entities: Record<string, EntityInfo> = {};

    visit(graphqlAst, {
        ScalarTypeDefinition(node) {
            scalars.push(node.name.value)
        },
        EnumTypeDefinition(node) {
            enums.push(node.name.value)
        },
        InputObjectTypeDefinition(node) {
            const inputName = node.name.value;

            const fields = node.fields?.map((field) => ({
                name: field.name.value,
                type: getTypeName(field.type),
            })) || [];

            inputs.push({
                inputName,
                fields
            });
        },
    })

    visit(graphqlAst, {
        ObjectTypeDefinition(node) {
            const entityName = node.name.value;
            if (entityName === 'Query' || entityName === 'Mutation') {
                return;
            }

            const entityIsSyncable = node.directives?.some(
                d => d.name.value === 'tag' && d.arguments?.some(arg => arg.name.value === 'name' && (arg.value as StringValueNode).value === 'sync')) ?? false;
            const entityDirectives: DirectiveMap = node.directives?.reduce((acc, curr) => {
                const directiveArgs: DirectiveMap = node.directives?.reduce((acc, directive) => {
                    acc[directive.name.value] = directive.arguments?.reduce((args, arg) => {
                        args[arg.name.value] = parseValueNode(arg.value);
                        return args;
                    }, {} as Record<string, any>);
                    return acc;
                }, {} as DirectiveMap) ?? {};

                // check if the directive is repeated on the entity
                if (!acc[curr.name.value]) {
                    acc[curr.name.value] = [];
                }
                acc[curr.name.value].push(
                    ...Object.entries(directiveArgs).map(([key, value]) => ({ key, value }))
                );
                return acc;
            }, {} as DirectiveMap) ?? {};
            entities[entityName] = {
                entityName,
                isSyncable: entityIsSyncable,
                directives: entityDirectives,
                isRecord: entityName.endsWith('Record'),
                isRecordEvent: entityName.endsWith('RecordEvent'),
                fields: {},
            };
            // https://prod-56.westus.logic.azure.com:443/workflows/4c8e44a193ae4d508752a72d3a43a859/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=HGfj_ptAYuYHy02EAMISTGvgtU8mLWeqmjYN_YQXbdQ
            node.fields
                //.filter((field) => {
                //   // ignore derived fields
                //   if (field.directives?.find((directive: DirectiveNode) => directive.name.value === 'tag' && ((directive.arguments?.find(arg => arg.name.value === 'name')?.value as StringValueNode).value === 'derived'))) {
                //     return false;
                //   }
                //   return true;
                // })
                ?.forEach((field) => {
                    const fieldTypeName = field.name.value;
                    let typeNode = field.type;
                    // let filterName = '';
                    // let filter: Record<string, any> = {};
                    // const orderBy: Record<string, any> = {};
                    let isList = false;
                    let isRequired = false;
                    // Unwrap NonNullType and ListType to get the base type
                    while (typeNode.kind === "NonNullType" || typeNode.kind === "ListType") {
                        if (typeNode.kind === Kind.NON_NULL_TYPE) {
                            isRequired = true;
                        }
                        if (typeNode.kind === 'ListType') {
                            isList = true;
                            // field.arguments?.forEach(argument => {
                            //   // add filter and orderBy
                            //   if (argument.type.kind === Kind.NAMED_TYPE) {
                            //     filter = inputTypes[argument.type.name.value];
                            //   }
                            // })
                        }
                        typeNode = typeNode.type;
                    }

                    const isRecord = typeNode.name.value.endsWith('Record');
                    const isRecordEventArray = typeNode.name.value.endsWith('RecordEvent');
                    const isScalar = SCALAR_TYPES.has(typeNode.name.value);
                    const isLifeCycleEventArray = isList && typeNode.name.value.includes('LifeCycle');
                    const isEnum = enums.includes(typeNode.name.value);
                    const isRelation = !isScalar && !isRecord && !isRecordEventArray && !isLifeCycleEventArray && !isEnum;
                    const fieldDirectives: DirectiveMap = (field.directives ?? []).reduce<DirectiveMap>((acc, directive) => {
                        const name = directive.name.value;
                        const args = directive.arguments ?? [];

                        const kvps = args.map(arg => ({
                            key: arg.name.value,
                            value: (arg.value as StringValueNode).value,
                        }));

                        acc[name] = (acc[name] ?? []).concat(kvps);
                        return acc;
                    }, {});


                    const fieldInfo: FieldInfo = {
                        entityName,
                        fieldName: fieldTypeName,
                        fieldType: typeNode.name.value,
                        to: isRelation ? typeNode.name.value : undefined,
                        isList,
                        isRelation,
                        isScalar,
                        isRecord,
                        isRecordEventArray,
                        isEnum,
                        isRequired,
                        isLifeCycleEventArray,
                        directives: fieldDirectives,
                        isSyncable: !!fieldDirectives?.tag?.find(({ key, value }: { key: string, value: string }) => key === 'name' && value === 'sync'),
                        isDerived: !!fieldDirectives?.tag?.find(({ key, value }: { key: string, value: string }) => key === 'name' && value === 'derived'),
                    }

                    if (!entities[entityName]) {
                        throw new Error(`'${entityName}' does not exist!!`)
                    }
                    entities[entityName].fields[fieldTypeName] = fieldInfo;

                    fields.push(fieldInfo);
                });
        },
    });

    const project = new Project({ libFolderPath: outputDir });
    const filePath = `${outputDir ?? '.'}/__generated__/types`;

    const referenceSourceFile = project.createSourceFile(`${filePath}/Reference.ts`, '', {
        scriptKind: ScriptKind.TS,
        overwrite: true
    });

    referenceSourceFile.addInterface({
        name: 'Reference',
        isExported: true,
        typeParameters: [{
            name: "T",
            constraint: "string | string[]",
        }],
        properties: [
            {
                name: '__typename',
                type: 'string'
            },
            {
                name: 'resolvable',
                type: 'boolean',
            },
            {
                name: 'uuid',
                type: 'T'
            }
        ]
    })

    const indexSourceFile = project.createSourceFile(`${outputDir ?? '.'}/index.ts`, '', {
        scriptKind: ScriptKind.TS,
        overwrite: true
    });

    indexSourceFile.addStatements([
        ...Object.values(entities).filter((entity) => entity.isSyncable || entity.isRecord).map((entity) => {
            return `export * from './__generated__/types/YDoc${entity.entityName}';`
        })
    ])
    indexSourceFile.addStatements([`export * from './__generated__/types/Reference';`]);

    //const lifeCycleTypeEnum = enums.filter(str => str.includes('LifeCycle'))[0]
    // create a file for each record type so we can reference them later
    Object.entries(entities)
        .filter(([, entity]) => entity.isRecord || entity.isSyncable)
        .forEach(([entityName, entity]) => {
            // both the record and record event will be in the same source file
            const sourceFile = project.createSourceFile(`${filePath}/YDoc${entityName}.ts`, '', {
                scriptKind: ScriptKind.TS,
                overwrite: true,
            });

            const containsReference = Object.values(entity.fields).some(field => field.isRelation);
            let lifeCycleEventContainsReference = false
            if (entity.isSyncable) {
                lifeCycleEventContainsReference = Object.values(entities[`LifeCycle${entityName}Event`]?.fields).some(field => field.isRelation);
            }

            if (containsReference || lifeCycleEventContainsReference) {
                sourceFile.addImportDeclaration({
                    moduleSpecifier: './Reference',
                    namedImports: ['Reference'],
                });
            }

            // start with the recordEvent
            if (entity.isRecord) {
                const recordEventEntity = entities[`${entityName}Event`];
                if (!recordEventEntity) {
                    throw new Error(`Cannot find ${entityName}Event`)
                }

                const recordEvent = sourceFile.addInterface({
                    name: `YDoc${recordEventEntity.entityName}`,
                    isExported: true,
                    properties: Object.entries(recordEventEntity.fields)
                        .filter(([__dirname, field]) => !field.isDerived)
                        .map(([fieldName, fieldInfo]) => ({
                            name: fieldName,
                            hasQuestionToken: !fieldInfo.isRequired,
                            type: graphqlToTSType(fieldInfo),
                        })),
                });

                recordEvent.addProperty({
                    name: '__typename',
                    type: 'string'
                })

                const record = sourceFile.addInterface({
                    name: `YDoc${entityName}`,
                    isExported: true,
                    properties: Object.entries(entity.fields)
                        .filter(([__dirname, field]) => !field.isDerived)
                        .map(([fieldName, fieldInfo]) => ({
                            name: fieldName,
                            hasQuestionToken: !fieldInfo.isRequired,
                            type: graphqlToTSType(fieldInfo),
                        })),
                });

                record.addProperty({
                    name: '__typename',
                    type: 'string'
                })

                return;
            }

            const importCustomTypes = Object.entries(entity.fields).filter(([_, field]) => field.isRecord).reduce<string[]>((acc, [key, field]) => {
                if (!acc.includes(field.fieldType)) {
                    acc.push(field.fieldType);
                }
                return acc;
            }, [])

            //importCustomTypes.push(lifeCycleTypeEnum);
            importCustomTypes.forEach((importType) => {
                let moduleSpecifier = `./YDoc${importType}`;
                let namedImport = `YDoc${importType}`;

                const importDecl = sourceFile.getImportDeclaration(decl =>
                    decl.getModuleSpecifierValue() === moduleSpecifier
                );

                const alreadyImported = importDecl?.getNamedImports().some(namedImport => namedImport.getName() === importType);

                if (!alreadyImported) {
                    if (importDecl) {
                        importDecl.addNamedImport(namedImport);
                    } else {
                        sourceFile.addImportDeclaration({
                            moduleSpecifier,
                            namedImports: [namedImport],
                        });
                    }
                }
            });

            const lifeCycleEventEntity = entities[`LifeCycle${entityName}Event`];
            if (!lifeCycleEventEntity) {
                throw new Error(`Cannot find LifeCycle${entityName}Event`)
            }

            const lifeCycleEvent = sourceFile.addInterface({
                name: `YDoc${lifeCycleEventEntity.entityName}`,
                isExported: true,
                properties: Object.entries(lifeCycleEventEntity.fields)
                    .filter(([__dirname, field]) => !field.isDerived)
                    .map(([fieldName, fieldInfo]) => {
                        if (fieldInfo.isRelation) {
                            return {
                                name: `${fieldName}__REF`,
                                hasQuestionToken: !fieldInfo.isRequired,
                                type: graphqlToTSType(fieldInfo),
                            }
                        } else if (fieldInfo.isEnum) {
                            return {
                                name: fieldName,
                                hasQuestionToken: !fieldInfo.isRequired,
                                type: 'string',
                            }
                        }
                        return {
                            name: fieldName,
                            hasQuestionToken: !fieldInfo.isRequired,
                            type: graphqlToTSType(fieldInfo),
                        }
                    }),
            });

            lifeCycleEvent.addProperty({
                name: '__typename',
                type: 'string'
            })

            const entityInterface = sourceFile.addInterface({
                name: `YDoc${entityName}`,
                isExported: true,
                properties: Object.entries(entity.fields)
                    .filter(([__dirname, field]) => !field.isDerived)
                    .map(([fieldName, fieldInfo]) => {
                        if (fieldInfo.isRelation && !fieldInfo.isLifeCycleEventArray) {
                            return {
                                name: `${fieldName}__REF`,
                                hasQuestionToken: !fieldInfo.isRequired,
                                type: graphqlToTSType(fieldInfo),
                            }
                        } else if (fieldInfo.isEnum) {
                            return {
                                name: fieldName,
                                hasQuestionToken: !fieldInfo.isRequired,
                                type: 'string',
                            }
                        }

                        return {
                            name: fieldName,
                            hasQuestionToken: !fieldInfo.isRequired,
                            type: graphqlToTSType(fieldInfo),
                        }
                    }),
            });

            entityInterface.addProperties([
                {
                    name: 'path',
                    type: 'string',
                },
                {
                    name: '__typename',
                    type: 'string'
                }
            ]);

        });

    await project.save()
    return project;
}

export const generateTypeScriptFilesFromSchema = async (schema: string, outputDir: string) => {
    createYDocFromSchema(schema, outputDir)
}