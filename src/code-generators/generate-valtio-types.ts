import {
    parse,
    visit,
    Kind,
    TypeNode,
    DirectiveNode,
    StringValueNode,
    ListValueNode,
    ValueNode
} from 'graphql';
import { Project, ScriptKind, SyntaxKind } from 'ts-morph';

export interface GraphQLToTSTypeInput {
    type: string;
    isArray?: boolean;
    isReference?: boolean;
}

export type DirectiveMap = Record<string, any>

export type EntityInfo = {
    fields: Record<string, FieldInfo>;
    isSyncable: boolean;
    isRecord: boolean;
    isRecordEvent: boolean;
    isLifeCycleEvent: boolean;
    directives: DirectiveMap;
    entityName: string;
    externalEntityFieldsNeeded: boolean;
}

export type LocalDependency = Record<string, {
    fileName: string,
    namedExports: string[],
}>

export type FieldInfo = {
    // entity
    entityName: string;
    fieldName: string;
    description?: string; // comment
    fieldType: string;
    to?: string;
    isScalar: boolean;
    isList: boolean;
    isRelation: boolean;
    isRecord: boolean;
    isRecordEventArray: boolean;
    isLifeCycleEventArray: boolean;
    isEnum: boolean;
    directives: DirectiveMap;
    isSyncable: boolean;
    isRequired: boolean;
    isDerived: boolean;
    calculation?: string;
    filter?: any;
    orderBy?: any;
}

function uncapitalize(str: string): string {
    if (!str) return ""; // handle empty string
    return str.charAt(0).toLowerCase() + str.slice(1);
}

const graphqlToTSType = (fieldName: string, { fieldType, isList, isEnum }: FieldInfo) => {
    const suffix = isList ? '[]' : '';
    const isRelation = fieldName.endsWith("__REF");

    if (isRelation && isList) {
        return `Reference<string[]>`
    } else if (isRelation) {
        return 'Reference<string>'
    }

    if (isEnum) {
        return 'string';
    }

    switch (fieldType) {
        case 'Int':
        case 'Float':
            return `number${suffix}`;
        case 'DateTime':
            return 'Date'
        case 'String':
        case 'ID':
            return `string${suffix}`;
        case 'Boolean':
            return `boolean${suffix}`;
        default:
            return `Valtio${fieldType}${suffix}`; // Default for custom types
    }
};

// todo: get these from the schema document
const SCALAR_TYPES = new Set([
    'Int',
    'Float',
    'String',
    'Boolean',
    'ID',
    'DateTime'
]);

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
export const createValtioTypesFromSchema = async (schema: string, outputDir?: string): Promise<Project> => {
    const graphqlAst = parse(schema);

    const scalars: string[] = []
    const enums: string[] = []
    const inputs: any[] = []
    const fields: FieldInfo[] = []
    const entities: Record<string, EntityInfo> = {};
    const mutationNames: string[] = [];

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
            if (entityName === 'Query') {
                return;
            } else if (entityName === 'Mutation') {
                node.fields?.forEach(field => {
                    const mutationName = field.name.value;
                    mutationNames.push(mutationName);
                });
                return;
            }

            const entityIsSyncable = !!node.directives?.find((directive: DirectiveNode) => (directive.name.value === 'tag' && ((directive.arguments?.find(arg => arg.name.value === 'name')?.value as StringValueNode).value === 'sync')))
            const externalEntityFieldsNeeded = !!node.directives?.find((directive: DirectiveNode) => (directive.name.value === 'externalEntityFields') && ((directive.arguments?.find(arg => arg.name.value === 'fields')?.value as ListValueNode).values.length > 0));
            const entityDirectives: DirectiveMap = node.directives?.reduce((acc, directive) => {
                acc[directive.name.value] = directive.arguments?.reduce((args, arg) => {
                    args[arg.name.value] = parseValueNode(arg.value);
                    return args;
                }, {} as Record<string, any>);
                return acc;
            }, {} as DirectiveMap) ?? {};
            entities[entityName] = {
                entityName,
                isSyncable: entityIsSyncable,
                directives: entityDirectives,
                externalEntityFieldsNeeded,
                isRecord: entityName.endsWith('Record'),
                isRecordEvent: entityName.endsWith('RecordEvent'),
                isLifeCycleEvent: entityName.includes('LifeCycle'),
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
                    let fieldTypeName = field.name.value;
                    let typeNode = field.type;
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
                    const isLifeCycleEventArray = isList && typeNode.name.value.includes('LifeCycle');
                    const isEnum = enums.includes(typeNode.name.value);
                    const isScalar = SCALAR_TYPES.has(typeNode.name.value);
                    const isRelation = !isScalar && !isRecord && !isRecordEventArray && !isLifeCycleEventArray && !isEnum;
                    const directives: DirectiveMap = (field.directives ?? []).reduce<DirectiveMap>((acc, directive) => {
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
                        description: field.description?.value,
                        fieldName: fieldTypeName,
                        fieldType: typeNode.name.value,
                        to: isRelation ? typeNode.name.value : undefined,
                        isList,
                        isRelation,
                        isScalar,
                        isRecord,
                        isRecordEventArray,
                        isLifeCycleEventArray,
                        isEnum,
                        directives,
                        isSyncable: !!directives?.tag?.find(({ key, value }: { key: string, value: string }) => key === 'name' && value === 'sync'),
                        isRequired,
                        isDerived: !!directives?.tag?.find(({ key, value }: { key: string, value: string }) => key === 'name' && value === 'derived'),
                        calculation: directives?.calculation?.length > 0 ? directives?.calculation[0]?.value : undefined,
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
    project.addSourceFilesAtPaths(`${outputDir}/**/*.ts`)

    //create index file to make exporting types easier to import and generate
    const filePath = `${outputDir ?? '.'}/index.ts`;

    const sourceFile = project.createSourceFile(filePath, '', {
        scriptKind: ScriptKind.TS,
        overwrite: true
    });

    sourceFile.addStatements([
        ...Object.values(entities).filter((entity) => entity.isSyncable || entity.isRecord || entity.isRecordEvent || entity.isLifeCycleEvent).map((entity) => {
            return `export * from './${entity.entityName}';`
        })
    ])

    Object.entries(entities)
        .filter(([_, entity]) => entity.isSyncable || entity.isRecord || entity.isRecordEvent || entity.isLifeCycleEvent || entity.externalEntityFieldsNeeded)
        .forEach(([entityName, entity]) => {
            const updateMutations = mutationNames.filter((name) => {
                const replaceName = name.replace(/([A-Z])/g, ' $1');
                const splitName = replaceName.trim().split(' ')
                if (splitName[1] === entityName) {
                    return name
                }
            });

            const filePath = `${outputDir ?? '.'}/${entityName}.ts`;

            let sourceFile = project.getSourceFile(filePath);
            if (!sourceFile) {
                sourceFile = project.createSourceFile(filePath, '', {
                    scriptKind: ScriptKind.TS,
                });
            }

            const importCustomTypes = Object.entries(entity.fields).filter(([_, field]) => field.isRecord || field.isLifeCycleEventArray || field.isRecordEventArray || (field.isRelation && entities[field.fieldType] && entities[field.fieldType].isSyncable && !entity.isLifeCycleEvent)).reduce<string[]>((acc, [key, field]) => {
                if (!acc.includes(field.fieldType)) {
                    acc.push(field.fieldType);
                }
                return acc;
            }, []);

            importCustomTypes.push('store', 'proxy', `YDoc${entity.entityName}`);


            const containsReference = Object.values(entity.fields).some(field => field.isRelation);
            if (containsReference) {
                importCustomTypes.push('Reference')
            }

            // Add all necessary imports to file 
            importCustomTypes.forEach((importType) => {
                let moduleSpecifier = `./${entityName}`
                if (importType.includes('YDoc') || importType === 'Reference') {
                    moduleSpecifier = `./../../yjs`
                } else if (importType === 'proxy') {
                    moduleSpecifier = `valtio`;
                } else if (importType == 'store') {
                    moduleSpecifier = `./../__generated__/store`
                } else if (Object.entries(entities).filter(([entityName, _]) => entityName === importType).length > 0) {
                    importType = 'Valtio' + importType;
                    moduleSpecifier = `.`;
                }

                const importDecl = sourceFile?.getImportDeclaration(decl =>
                    decl.getModuleSpecifierValue() === moduleSpecifier
                );

                const alreadyImported = importDecl?.getNamedImports().some(namedImport => namedImport.getName() === importType);

                if (!alreadyImported) {
                    if (importDecl) {
                        importDecl.addNamedImport(importType);
                    } else {
                        sourceFile?.addImportDeclaration({
                            moduleSpecifier,
                            namedImports: [importType],
                        });
                    }
                }
            });

            if (updateMutations.length > 0) {
                let fieldPayloadMap = sourceFile.getTypeAlias(`${entityName}FieldPayloadMap`);
                if (!fieldPayloadMap) {
                    fieldPayloadMap = sourceFile.addTypeAlias({
                        name: `${entityName}FieldPayloadMap`,
                        type: writer => {
                            writer.write("{").newLine();
                            for (const name of updateMutations) {
                                const replaceName = name.replace(/([A-Z])/g, ' $1');
                                const splitName = replaceName.trim().split(' ')
                                const newName = splitName.slice(2);
                                const fieldName = newName.join("").charAt(0).toLowerCase() + newName.join("").slice(1);;
                                const field = entity.fields[fieldName]
                                let fieldType = "";
                                if (field && !field.isRecord) {
                                    fieldType = graphqlToTSType(field.fieldName, field);
                                    if (entities[fieldType.slice(6)]) {
                                        fieldType = "string"
                                    }
                                } else {
                                    fieldType = 'any';
                                }
                                writer.write(`${fieldName}: ${fieldType};`).newLine();
                            }
                            writer.write("}");
                        },
                        isExported: false,
                    });
                }


                const fieldNameType = sourceFile.getTypeAlias("FieldName");
                if (!fieldNameType) {
                    sourceFile.addTypeAlias({
                        name: 'FieldName',
                        type: `keyof ${entityName}FieldPayloadMap`
                    });
                }

            }

            let entityInterface = sourceFile.getInterface(`Valtio${entityName}`);

            if (!entityInterface) {
                entityInterface = sourceFile.addInterface({
                    name: `Valtio${entityName}`,
                    isExported: true,
                })
            }

            const existingFields = entityInterface?.getProperties().map(field => {
                return {
                    name: field.getName(),
                    type: field.getType().getText()
                }
            });

            const ydocFields = Object.values(entity.fields).flatMap((field) => {
                if (field.isRelation) {
                    return [`${field.fieldName}__REF`, field.fieldName];
                }
                return field.fieldName
            });

            ydocFields.push('__typename')

            if (entity.externalEntityFieldsNeeded) {
                ydocFields.push('path');
                ydocFields.push(...entity.directives['externalEntityFields'].fields.map((field: { fieldName: string, type: string }) => field.fieldName));

                entity.directives['externalEntityFields'].fields.forEach((field: { fieldName: string, type: string }) => {
                    const existingProp = entityInterface?.getProperty(field.fieldName);

                    if (!existingProp) {
                        const isRequired = field.type.includes("!")
                        entityInterface?.addProperty({
                            name: field.fieldName,
                            type: isRequired ? field.type.toLowerCase().slice(0, -1) : `${field.type.toLowerCase} | undefined`,
                            hasQuestionToken: !isRequired,
                        });
                    }
                })
            } else if (entity.isSyncable) {
                ydocFields.push('path');
                ydocFields.push('_version');
                ydocFields.push('update');
            }

            Object.entries(entity.fields).forEach(([fieldName, fieldInfo]) => {
                if (!fieldInfo.isDerived) {
                    if (fieldInfo.isRelation) {
                        const name = `${fieldName}__REF`;

                        const existingProp = entityInterface?.getProperty(name);
                        const existingGetter = entityInterface?.getGetAccessor(fieldName)
                        const fieldTypeIsSyncable = entities[fieldInfo.fieldType] && entities[fieldInfo.fieldType].isSyncable;

                        if (!existingProp || !existingGetter) {
                            if (!existingProp) {
                                entityInterface?.addProperty({
                                    name,
                                    type: graphqlToTSType(name, fieldInfo),
                                    hasQuestionToken: !fieldInfo.isRequired,
                                    docs: fieldInfo.description ? [fieldInfo.description] : undefined
                                });
                            }

                            if (!existingGetter && fieldTypeIsSyncable && !entity.isLifeCycleEvent) {
                                entityInterface?.addGetAccessor({
                                    name: fieldName,
                                    returnType: fieldInfo.isRequired ? graphqlToTSType(fieldName, fieldInfo) : `${graphqlToTSType(fieldName, fieldInfo)} | undefined`,
                                    docs: fieldInfo.description ? [fieldInfo.description] : undefined
                                });
                            }
                        } else {
                            const graphqlFieldRefType = graphqlToTSType(name, fieldInfo);
                            const graphqlFieldType = graphqlToTSType(fieldName, fieldInfo)
                            const existingFieldRefType = existingFields.find((field) => field.name === name)
                            const existingFieldType = existingFields.find((field) => field.name === fieldName)

                            if (!existingFieldType?.type?.endsWith(graphqlFieldType) && !existingFieldRefType?.type?.endsWith(graphqlFieldRefType)) {
                                existingProp.setType(graphqlFieldRefType);
                                existingGetter.setReturnType(fieldInfo.isRequired ? graphqlFieldType : `${graphqlFieldType} | undefined`)
                            }

                            const existingComments = existingProp.getJsDocs();
                            if (fieldInfo.description && existingComments.length === 0) {
                                existingProp.addJsDocs([fieldInfo.description])
                            } else if (fieldInfo.description && existingComments[0]?.getCommentText() !== fieldInfo.description) {
                                existingComments[0].setDescription(fieldInfo.description);
                            }
                        }
                        return
                    }

                    const existingProp = entityInterface?.getProperty(fieldName);
                    if (!existingProp) {
                        entityInterface?.addProperty({
                            name: fieldName,
                            type: fieldInfo.isEnum ? 'string' : graphqlToTSType(fieldName, fieldInfo),
                            hasQuestionToken: !fieldInfo.isRequired,
                            docs: fieldInfo.description ? [fieldInfo.description] : undefined
                        });
                    } else {
                        const graphqlFieldType = fieldInfo.isEnum ? 'string' : graphqlToTSType(fieldName, fieldInfo);
                        const existingFieldType = existingFields.find((field) => field.name === fieldName)

                        if (!existingFieldType?.type?.endsWith(graphqlFieldType)) {
                            existingProp.setType(graphqlFieldType);
                        }

                        const existingComments = existingProp.getJsDocs();
                        if (fieldInfo.description && existingComments.length === 0) {
                            existingProp.addJsDocs([fieldInfo.description])
                        } else if (fieldInfo.description && existingComments[0]?.getCommentText() !== fieldInfo.description) {
                            existingComments[0].setDescription(fieldInfo.description);
                        }
                    }
                } else {
                    const existingProp = entityInterface?.getGetAccessor(fieldName);
                    if (!existingProp) {
                        entityInterface?.addGetAccessor({
                            name: fieldName,
                            returnType: fieldInfo.isRequired ? graphqlToTSType(fieldName, fieldInfo) : `${graphqlToTSType(fieldName, fieldInfo)} | undefined`,
                            docs: fieldInfo.description ? [fieldInfo.description] : undefined
                        });
                    }
                }

            });

            for (const prop of entityInterface.getProperties()) {
                if (!ydocFields.includes(prop.getName())) {
                    prop.remove();
                }
            }

            for (const prop of entityInterface.getGetAccessors()) {
                if (!ydocFields.includes(prop.getName())) {
                    prop.remove();
                }
            }

            let existingProp = entityInterface.getProperty('__typename');
            if (!existingProp) {
                entityInterface.addProperty({
                    name: '__typename',
                    type: 'string',
                });
            }

            existingProp = entityInterface.getProperty('path');
            if (!existingProp && (entity.isSyncable || entity.externalEntityFieldsNeeded)) {
                entityInterface.addProperties([
                    {
                        name: 'path',
                        type: 'string',
                    }
                ])
            }

            existingProp = entityInterface.getProperty('_version');
            if (!existingProp && entity.isSyncable) {
                entityInterface.addProperties([
                    {
                        name: '_version',
                        type: 'number',
                    }
                ])
            }

            existingProp = entityInterface.getProperty('update');
            if (!existingProp && entity.isSyncable) {
                entityInterface.addProperties([
                    {
                        name: 'update',
                        type: `<K extends FieldName>(field: K, value: ${entityName}FieldPayloadMap[K]) => Promise<string>`,
                    }
                ])
            }

            if (entity.isSyncable) {
                const lifeCycleEventsFunction = sourceFile.getFunctions().some(fn => fn.getName() === `buildLifeCycle${entityName}Events`);
                if (!lifeCycleEventsFunction) {
                    sourceFile.addFunction({
                        name: `buildLifeCycle${entityName}Events`,
                        isExported: true,
                        returnType: `ValtioLifeCycle${entityName}Event[]`,
                        parameters: [{ name: 'events', type: `any[]` }],
                        statements: [
                            `return events.map((event) =>{
                        return {
                        uuid: event.uuid,
                            ${uncapitalize(entityName)}__REF: event.${uncapitalize(entityName)}__REF,
                            type: event.type,
                            value: event.value === '' ? undefined : new Date(event.value),
                            createdAt: new Date(event.createdAt),
                            __typename: \'LifeCycle${entityName}Event\',
                        }
                    });`
                        ]
                    });
                }

                let upsertFunction = sourceFile.getFunction(`upsert${entityName}ValtioEntity`);
                if (!upsertFunction) {
                    upsertFunction = sourceFile.addFunction({
                        name: `upsert${entityName}ValtioEntity`,
                        isExported: true,
                        isAsync: true,
                        parameters: [{ name: 'ydoc', type: `YDoc${entityName}` }],
                        statements: [
                            `if (!store.${entityName}Map[ydoc.uuid]) {
                                store.${entityName}Map[ydoc.uuid] = proxy({} as Valtio${entityName})
                            }`,
                            `const ${uncapitalize(entityName)} = store.${entityName}Map[ydoc.uuid]
                            if (!${uncapitalize(entityName)}) {
                                throw new Error('${entityName} does not exist')
                            }`,
                            `${uncapitalize(entityName)}.__typename =  \'${entityName}\';`,
                            `${uncapitalize(entityName)}.path = ydoc.path;`,
                            `${uncapitalize(entityName)}._version = 0;`,
                            ...Object.values(entity.fields).filter((field) => !field.isDerived).map((field) => {
                                if (field.isScalar || field.isEnum) {
                                    return `${uncapitalize(entityName)}.${field.fieldName} = ydoc.${field.fieldName};`
                                }

                                if (field.isRelation) {
                                    return `${uncapitalize(entityName)}.${field.fieldName}__REF = ydoc.${field.fieldName}__REF;`
                                }

                                if (field.isLifeCycleEventArray) {
                                    return `${uncapitalize(entityName)}.${field.fieldName} = buildLifeCycle${entityName}Events(ydoc.${field.fieldName});`
                                }

                                if (field.isRecord) {
                                    const importName = `build${field.fieldType}`;
                                    const moduleName = `./${field.fieldType}`;
                                    const importDecl = sourceFile?.getImportDeclaration(decl =>
                                        decl.getModuleSpecifierValue() === moduleName
                                    );

                                    const hasNamedImport = importDecl?.getNamedImports().some(namedImport =>
                                        namedImport.getName() === importName
                                    );
                                    if (!hasNamedImport) {
                                        if (importDecl) {
                                            importDecl.addNamedImport(importName);
                                        } else {
                                            sourceFile?.addImportDeclaration({
                                                moduleSpecifier: moduleName,
                                                namedImports: [importName],
                                            });
                                        }
                                    }
                                    return `${uncapitalize(entityName)}.${field.fieldName} = ${importName}(ydoc.${field.fieldName});`
                                }

                                return '';
                            }),
                        ]
                    });

                    upsertFunction?.addStatements([
                        ...Object.values(entity.fields).filter((field) => field.isDerived || field.isRelation).map((field) => {
                            const fieldTypeEntity = entities[field.fieldType];
                            const lowerCaseFieldType = uncapitalize(field.fieldType);
                            if (field.isRelation && fieldTypeEntity?.isSyncable) {
                                if (field.isList) {
                                    return `Object.defineProperty(${uncapitalize(entityName)}, '${field.fieldName}', {
                                    get() {
                                        return Object.values(store.${field.fieldType}Map).filter((${lowerCaseFieldType}) => ${lowerCaseFieldType}?.${uncapitalize(entityName)}__REF?.uuid === this.uuid).map((${lowerCaseFieldType}) => ${lowerCaseFieldType});
                                    }
                                });`
                                } else if (!Object.values(fieldTypeEntity?.fields).some(field => field.fieldName.includes(entityName))) {
                                    return `Object.defineProperty(${uncapitalize(entityName)}, '${field.fieldName}', {
                                    get() {
                                        return Object.values(store.${field.fieldType}Map).filter((${lowerCaseFieldType}) => ${lowerCaseFieldType}?.uuid === this.${field.fieldName}__REF.uuid)[0];
                                    }
                                });`
                                } else {
                                    return `Object.defineProperty(${uncapitalize(entityName)}, '${field.fieldName}', {
                                    get() {
                                        return Object.values(store.${field.fieldType}Map).filter((${lowerCaseFieldType}) => ${lowerCaseFieldType}?.${uncapitalize(entityName)}s__REF?.uuid.includes(this.uuid))[0];
                                    }
                                });`
                                }

                            }

                            if (field.isDerived) {
                                if (field.fieldName === 'createdAt') {
                                    return `Object.defineProperty(${uncapitalize(entityName)}, 'createdAt', {
                                    get() {
                                        return new Date(this.lifeCycleEvents[0].createdAt);
                                    }
                                });`
                                } else if (field.fieldName === 'archivedAt') {
                                    return `Object.defineProperty(${uncapitalize(entityName)}, 'archivedAt', {
                                get() {
                                    const latestEvent = [...this.lifeCycleEvents].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

                                    if (latestEvent.type == \'ARCHIVAL\' && latestEvent.value != null) {
                                        return latestEvent.value
                                    } else {
                                        return undefined
                                    }
                                }
                                 });`
                                } else if (field.calculation) {
                                    let calcString = field.calculation?.replace(/\s/g, "").split('.');
                                    if (calcString[0] === entityName) {
                                        calcString[0] = 'this';
                                        const calc = calcString.join('.')
                                        return `Object.defineProperty(${uncapitalize(entityName)}, '${field.fieldName}', {
                                    get(){
                                        return ${calc};
                                    }
                                })`
                                    }
                                } else {
                                    return `Object.defineProperty(${uncapitalize(entityName)}, '${field.fieldName}', {
                                    get(){
                                        /* Implement ${field.fieldName} */;
                                    }
                                })`
                                }
                            }
                            return ''
                        })
                    ]);
                } else {
                    // Check current schema non derived values
                    const schemaNonDerivedValues = Object.values(entity.fields).filter((field) => !field.isDerived)

                    // Compare schema is the current state of the existing upsert function
                    // remove, add, and update everything necessary to match 
                    const nonDerivedValueCalls = upsertFunction.getDescendantsOfKind(SyntaxKind.BinaryExpression)
                        .filter(call => {
                            const stringCall = call.getText();
                            return stringCall.includes(" = ") && !stringCall.includes('proxy') && !stringCall.includes('__typename') && !stringCall.includes('path') && !stringCall.includes('_version')
                        });

                    const existingNonDerivedFieldValues = nonDerivedValueCalls.map(call => {
                        const stringifyCall = call.getText();
                        const splitCall = stringifyCall.split('.');
                        return splitCall[3]?.split(' ')[0];
                    });

                    if (schemaNonDerivedValues.length > existingNonDerivedFieldValues.length) {
                        schemaNonDerivedValues.filter((field) => !existingNonDerivedFieldValues.some(name => name && name.includes(field.fieldName))).forEach((field) => {
                            let statements: string[] = [];
                            if (field.isScalar || field.isEnum) {
                                statements.push(`${uncapitalize(entityName)}.${field.fieldName} = ydoc.${field.fieldName};`)
                            }

                            if (field.isRelation) {
                                statements.push(`${uncapitalize(entityName)}.${field.fieldName}__REF = ydoc.${field.fieldName}__REF;`)
                            }

                            if (field.isLifeCycleEventArray) {
                                statements.push(`${uncapitalize(entityName)}.${field.fieldName} = buildLifeCycle${entityName}Events(ydoc.${field.fieldName});`)
                            }

                            if (field.isRecord) {
                                const importName = `build${field.fieldType}`;
                                const moduleName = `./${field.fieldType}`;
                                const importDecl = sourceFile?.getImportDeclaration(decl =>
                                    decl.getModuleSpecifierValue() === moduleName
                                );

                                const hasNamedImport = importDecl?.getNamedImports().some(namedImport =>
                                    namedImport.getName() === importName
                                );
                                if (!hasNamedImport) {
                                    if (importDecl) {
                                        importDecl.addNamedImport(importName);
                                    } else {
                                        sourceFile?.addImportDeclaration({
                                            moduleSpecifier: moduleName,
                                            namedImports: [importName],
                                        });
                                    }
                                }
                                statements.push(`${uncapitalize(entityName)}.${field.fieldName} = ${importName}(ydoc.${field.fieldName});`)
                            }
                            upsertFunction?.addStatements(statements)
                        });
                    } else if (schemaNonDerivedValues.length < existingNonDerivedFieldValues.length) {
                        const schemaFieldNames = schemaNonDerivedValues.map(field => field.fieldName)
                        existingNonDerivedFieldValues.filter((field) => !schemaFieldNames.includes(field.split('__REF')[0])).forEach((field) => {
                            const removeCall = nonDerivedValueCalls.find((call) => call.getText().includes(field));
                            const parent = removeCall?.getParent()?.asKind(SyntaxKind.ExpressionStatement);
                            parent?.remove()
                        })
                    }

                    // Check for current schema changes for derived fields or syncable relationships
                    const schemaDerivedValues = Object.values(entity.fields).filter((field) => field.isDerived || (field.isRelation && entities[field.fieldType] && entities[field.fieldType].isSyncable))

                    // Check derived values to ensure existing implementations don't get overwritten unless changed
                    // Existing getters on entity
                    const derievdValueCalls = upsertFunction.getDescendantsOfKind(SyntaxKind.CallExpression)
                        .filter(call => {
                            const expression = call.getExpression().getText();
                            return expression.includes("Object.defineProperty");
                        });

                    const existingDerivedValues = derievdValueCalls.map((call) => call.getArguments()[1]?.getText().slice(1, -1))

                    for (const call of derievdValueCalls) {
                        const fieldName = call.getArguments()[1]?.getText().slice(1, -1);
                        const entityField = entity.fields[fieldName];
                        let existingCalc = call.getFullText().split('\n')[3].replace(/\s/g, "")

                        // archivedAt and createdAt have default calculations that never change
                        if (fieldName === 'createdAt' || fieldName === 'archivedAt' || (!entityField?.calculation && !existingCalc.includes(`Implement ${fieldName}`))) {
                            continue
                        }

                        if (entityField?.calculation) {
                            let calcString = entityField.calculation?.replace(/\s/g, "").split('.');
                            calcString[0] = 'this';
                            const calc = calcString.join('.');

                            if (!existingCalc.includes(calc)) {
                                call.removeArgument(2);
                                call.addArgument(`{
                                    get() {
                                        return ${calc};
                                }
                                        }`)
                            }
                            return;
                        }
                    }

                    if (schemaDerivedValues.length > existingDerivedValues.length) {
                        schemaDerivedValues.filter((field) => !existingDerivedValues.includes(field.fieldName)).forEach((field) => {
                            const fieldTypeEntity = entities[field.fieldType]
                            const lowerCaseFieldType = uncapitalize(field.fieldType)
                            if (field.isRelation && fieldTypeEntity?.isSyncable) {
                                if (field.isList) {
                                    upsertFunction?.addStatements([`Object.defineProperty(${uncapitalize(entityName)}, '${field.fieldName}', {
                                    get() {
                                        return Object.values(store.${field.fieldType}Map).filter((${lowerCaseFieldType}) => ${lowerCaseFieldType}.${uncapitalize(entityName)}__REF?.uuid === this.uuid).map((${lowerCaseFieldType}) => ${lowerCaseFieldType});
                                    }
                                });`])
                                } else if (!Object.values(fieldTypeEntity?.fields).some(field => field.fieldName.includes(entityName))) {
                                    return `Object.defineProperty(${uncapitalize(entityName)}, '${field.fieldName}', {
                                    get() {
                                        return Object.values(store.${field.fieldType}Map).filter((${lowerCaseFieldType}) => ${lowerCaseFieldType}?.uuid === this.${field.fieldName}__REF.uuid)[0];
                                    }
                                });`
                                } else {
                                    upsertFunction?.addStatements([`Object.defineProperty(${uncapitalize(entityName)}, '${field.fieldName}', {
                                    get() {
                                        return Object.values(store.${field.fieldType}Map).filter((${lowerCaseFieldType}) => ${lowerCaseFieldType}.${uncapitalize(entityName)}s__REF?.uuid.includes(this.uuid)).map((${lowerCaseFieldType}) => ${lowerCaseFieldType})[0];
                                    }
                                });`])
                                }

                            } else if (field.calculation) {
                                let calcString = field.calculation?.replace(/\s/g, "").split('.');
                                if (calcString[0] === entityName) {
                                    calcString[0] = 'this';
                                    const calc = calcString.join('.')
                                    upsertFunction?.addStatements([`Object.defineProperty(${uncapitalize(entityName)}, '${field.fieldName}', {
                                    get(){
                                        return ${calc};
                                    }
                                })`])
                                }
                            } else {
                                upsertFunction?.addStatements([`Object.defineProperty(${uncapitalize(entityName)}, '${field.fieldName}', {
                                    get(){
                                        /* Implement ${field.fieldName} */;
                                    }
                                })`])
                            }
                            return "";
                        });
                    } else if (schemaDerivedValues.length < existingDerivedValues.length) {
                        existingDerivedValues.filter((field) => !schemaDerivedValues.map(field => field.fieldName).includes(field)).forEach((field) => {
                            const removeCall = derievdValueCalls.find((call) => call.getArguments()[1]?.getText().slice(1, -1) === field);
                            const parentStmt = removeCall?.getFirstAncestorByKind(SyntaxKind.ExpressionStatement);
                            parentStmt?.remove();
                        })
                    }
                }
            } else if (entity.isRecord) {
                const importName = `build${entityName}Event`;
                const moduleName = `./${entityName}Event`;
                const importDecl = sourceFile.getImportDeclaration(decl =>
                    decl.getModuleSpecifierValue() === moduleName
                );

                const hasNamedImport = importDecl?.getNamedImports().some(namedImport =>
                    namedImport.getName() === importName
                );

                if (!hasNamedImport) {
                    if (importDecl) {
                        importDecl.addNamedImport(importName);
                    } else {
                        sourceFile.addImportDeclaration({
                            moduleSpecifier: moduleName,
                            namedImports: [importName],
                        });
                    }
                }

                const buildFunction = sourceFile.getFunctions().some(fn => fn.getName() === `build${entityName}`);
                if (!buildFunction) {
                    sourceFile.addFunction({
                        name: `build${entityName}`,
                        isExported: true,
                        returnType: `Valtio${entityName}`,
                        parameters: [{ name: 'input', type: `any` }],
                        statements: [
                            'return {',
                            `__typename: \'${entityName}\',`,
                            ...Object.entries(entity.fields).map(([_, field]) => {
                                if (field.isScalar && field.isRequired) {
                                    return `${field.fieldName}: input.${field.fieldName},`
                                }
                                if (field.isRecordEventArray) {
                                    return `${field.fieldName}: input.${field.fieldName}.map((event: any) => build${entityName}Event(event)),`
                                }
                                if (field.fieldName === 'currentValue') {
                                    return `get ${field.fieldName}() {
                                            return this.eventHistory.slice(-1)?.[0]?.value;
                                        }`
                                }
                                return '';
                            }),
                            '}',
                        ]
                    });
                }
            } else if (entity.isRecordEvent) {
                const buildFunction = sourceFile.getFunctions().some(fn => fn.getName() === `build${entityName}`);
                if (!buildFunction) {
                    sourceFile.addFunction({
                        name: `build${entityName}`,
                        isExported: true,
                        returnType: `Valtio${entityName}`,
                        parameters: [{ name: 'input', type: `any` }],
                        statements: [
                            'return {',
                            `__typename: \'${entityName}\',`,
                            ...Object.entries(entity.fields).map(([_, field]) => {
                                if (field.fieldName === 'value') {
                                    if (entityName.includes('Time')) {
                                        return `value: input.value !== "" ? new Date(input.value) : undefined,`
                                    } else if (entityName.includes('String')) {
                                        return `value: input.value !== "" ? input.value : undefined,`
                                    } else if (entityName.includes('Int')) {
                                        return `value: input.value !== "" ? Number(input.value) : undefined,`
                                    }
                                } else {
                                    if (field.isScalar && field.isRequired) {
                                        return `${field.fieldName}: input.${field.fieldName},`
                                    }
                                }
                                return '';
                            }),
                            '}'
                        ]
                    });
                }
            } else if (entity.externalEntityFieldsNeeded) {
                let externalUpsert = sourceFile.getFunction(`upsert${entityName}ValtioEntity`);
                if (!externalUpsert) {
                    externalUpsert = sourceFile.addFunction({
                        name: `upsert${entityName}ValtioEntity`,
                        isExported: true,
                        parameters: [{ name: 'ydoc', type: 'any' }],
                        statements: [
                            `if (!store.${entityName}Map[ydoc.uuid]) {
                                store.${entityName}Map[ydoc.uuid] = proxy({} Valtio${entityName})
                            }`,
                            `const ${uncapitalize(entityName)} = store.${entityName}Map[ydocFields.uuid];`,
                            `if (!${uncapitalize(entityName)}){
                                throw new Error('${entityName} does not exist')
                            }`,
                            `${uncapitalize(entityName)}.__typename =  \'${entityName}\';`,
                            `${uncapitalize(entityName)}.path = ydoc.path;`,
                            ...Object.values(entity.fields).filter((field) => !field.isDerived).map((field) => {
                                if (field.isScalar || field.isEnum) {
                                    if (field.isRequired || field.isEnum) {
                                        return `${uncapitalize(entityName)}.${field.fieldName} = ydoc.${field.fieldName};`
                                    } else {
                                        return `${uncapitalize(entityName)}.${field.fieldName} = ydoc.${field.fieldName} === "" ? undefined : ydoc.${field.fieldName};`
                                    }
                                }

                                if (field.isRelation) {
                                    return `${uncapitalize(entityName)}.${field.fieldName}__REF = ydoc.${field.fieldName}__REF;`
                                }

                                return '';
                            }),
                            ...Object.values(entity.directives['externalEntityFields'].fields).map((field) => {
                                if ((field as any).type.includes('!')) {
                                    return `${uncapitalize(entityName)}.${(field as any).fieldName} = ydoc.${(field as any).fieldName};`;
                                } else {
                                    return `${uncapitalize(entityName)}.${(field as any).fieldName} = ydoc.${(field as any).fieldName} === "" ? undefined : ydoc.${(field as any).fieldName};`
                                }
                            }),
                        ]
                    });
                }

            }

            // Remove all unused imports from file
            sourceFile.getImportDeclarations().forEach((importDecl) => {
                const namedImports = importDecl.getNamedImports();

                // Filter out unused named imports
                const unusedNamedImports = namedImports.filter((namedImport) => {
                    const name = namedImport.getNameNode().getText();
                    const usages = sourceFile?.getDescendantsOfKind(SyntaxKind.Identifier).filter(identifier =>
                        identifier.getText() === name
                    );
                    if (usages) {
                        return usages.length <= 1
                    }
                    return;
                });

                // Remove unused ones
                unusedNamedImports.forEach((namedImport) => namedImport.remove());

                // If all named imports are removed or it's an unused default/namespace import, remove the entire import
                if (
                    importDecl.getNamedImports().length === 0 &&
                    !importDecl.getDefaultImport() &&
                    !importDecl.getNamespaceImport()
                ) {
                    importDecl.remove();
                }
            });

            sourceFile.formatText();
            // 4. Save the file to disk
            sourceFile.save().then(() => {
                console.log("File saved successfully!");
            });
        })
    return project;
}