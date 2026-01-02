// import { GraphQLResolveInfo } from 'graphql';
// import { DataSourceContext } from '../types/DataSourceContext';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  _FieldSet: any;
};

export type CheckCompatibleHazmatInput = {
  compatibilityGroup: Scalars['String'];
  hazardClassDivisionNumber: Scalars['String'];
  properShippingName: Scalars['String'];
  unid: Scalars['String'];
  packingGroup: Scalars['String'];
};

export type CheckCompatibleHazmatOutput = {
  __typename?: 'CheckCompatibleHazmatOutput';
  hazmatCompatibilityKeys: Array<Array<HazmatCompatibilityKey>>;
  segregatedHazmatMaterials: Array<SegregatedHazmatMaterial>;
};

export type HazmatCompatibilityKey = {
  __typename?: 'HazmatCompatibilityKey';
  compatibilityGroup: Scalars['String'];
  hazardClassDivisionNumber: Scalars['String'];
  properShippingName: Scalars['String'];
  unid: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  checkCompatibleHazmat: CheckCompatibleHazmatOutput;
};


export type QueryCheckCompatibleHazmatArgs = {
  input: Array<CheckCompatibleHazmatInput>;
};

export type SegregatedHazmatMaterial = {
  __typename?: 'SegregatedHazmatMaterial';
  hazmatObjectPair: Array<HazmatCompatibilityKey>;
  segregationDescription: Scalars['String'];
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  // info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  // info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  // info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  // info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

// export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  // info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  CheckCompatibleHazmatInput: CheckCompatibleHazmatInput;
  String: ResolverTypeWrapper<Scalars['String']>;
  CheckCompatibleHazmatOutput: ResolverTypeWrapper<CheckCompatibleHazmatOutput>;
  HazmatCompatibilityKey: ResolverTypeWrapper<HazmatCompatibilityKey>;
  Query: ResolverTypeWrapper<{}>;
  SegregatedHazmatMaterial: ResolverTypeWrapper<SegregatedHazmatMaterial>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  CheckCompatibleHazmatInput: CheckCompatibleHazmatInput;
  String: Scalars['String'];
  CheckCompatibleHazmatOutput: CheckCompatibleHazmatOutput;
  HazmatCompatibilityKey: HazmatCompatibilityKey;
  Query: {};
  SegregatedHazmatMaterial: SegregatedHazmatMaterial;
  Boolean: Scalars['Boolean'];
}>;

// export type CheckCompatibleHazmatOutputResolvers<ContextType = DataSourceContext, ParentType extends ResolversParentTypes['CheckCompatibleHazmatOutput'] = ResolversParentTypes['CheckCompatibleHazmatOutput']> = ResolversObject<{
//   hazmatCompatibilityKeys?: Resolver<Array<Array<ResolversTypes['HazmatCompatibilityKey']>>, ParentType, ContextType>;
//   segregatedHazmatMaterials?: Resolver<Array<ResolversTypes['SegregatedHazmatMaterial']>, ParentType, ContextType>;
//   __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
// }>;

// export type HazmatCompatibilityKeyResolvers<ContextType = DataSourceContext, ParentType extends ResolversParentTypes['HazmatCompatibilityKey'] = ResolversParentTypes['HazmatCompatibilityKey']> = ResolversObject<{
//   compatibilityGroup?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
//   hazardClassDivisionNumber?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
//   properShippingName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
//   unid?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
//   __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
// }>;

// export type QueryResolvers<ContextType = DataSourceContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
//   checkCompatibleHazmat?: Resolver<ResolversTypes['CheckCompatibleHazmatOutput'], ParentType, ContextType, RequireFields<QueryCheckCompatibleHazmatArgs, 'input'>>;
// }>;

// export type SegregatedHazmatMaterialResolvers<ContextType = DataSourceContext, ParentType extends ResolversParentTypes['SegregatedHazmatMaterial'] = ResolversParentTypes['SegregatedHazmatMaterial']> = ResolversObject<{
//   hazmatObjectPair?: Resolver<Array<ResolversTypes['HazmatCompatibilityKey']>, ParentType, ContextType>;
//   segregationDescription?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
//   __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
// }>;

// export type Resolvers<ContextType = DataSourceContext> = ResolversObject<{
//   CheckCompatibleHazmatOutput?: CheckCompatibleHazmatOutputResolvers<ContextType>;
//   HazmatCompatibilityKey?: HazmatCompatibilityKeyResolvers<ContextType>;
//   Query?: QueryResolvers<ContextType>;
//   SegregatedHazmatMaterial?: SegregatedHazmatMaterialResolvers<ContextType>;
// }>;

