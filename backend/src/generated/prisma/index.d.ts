
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model UserAccount
 * 
 */
export type UserAccount = $Result.DefaultSelection<Prisma.$UserAccountPayload>
/**
 * Model UserProfile
 * 
 */
export type UserProfile = $Result.DefaultSelection<Prisma.$UserProfilePayload>
/**
 * Model PoliticalAlignment
 * 
 */
export type PoliticalAlignment = $Result.DefaultSelection<Prisma.$PoliticalAlignmentPayload>
/**
 * Model InfluenceMetrics
 * 
 */
export type InfluenceMetrics = $Result.DefaultSelection<Prisma.$InfluenceMetricsPayload>
/**
 * Model Settings
 * 
 */
export type Settings = $Result.DefaultSelection<Prisma.$SettingsPayload>
/**
 * Model Post
 * 
 */
export type Post = $Result.DefaultSelection<Prisma.$PostPayload>
/**
 * Model Thread
 * 
 */
export type Thread = $Result.DefaultSelection<Prisma.$ThreadPayload>
/**
 * Model Reaction
 * 
 */
export type Reaction = $Result.DefaultSelection<Prisma.$ReactionPayload>
/**
 * Model Persona
 * 
 */
export type Persona = $Result.DefaultSelection<Prisma.$PersonaPayload>
/**
 * Model NewsItem
 * 
 */
export type NewsItem = $Result.DefaultSelection<Prisma.$NewsItemPayload>
/**
 * Model Trend
 * 
 */
export type Trend = $Result.DefaultSelection<Prisma.$TrendPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const PersonaType: {
  POLITICIAN: 'POLITICIAN',
  INFLUENCER: 'INFLUENCER',
  JOURNALIST: 'JOURNALIST',
  ACTIVIST: 'ACTIVIST',
  BUSINESS: 'BUSINESS',
  ENTERTAINER: 'ENTERTAINER'
};

export type PersonaType = (typeof PersonaType)[keyof typeof PersonaType]


export const ToneStyle: {
  PROFESSIONAL: 'PROFESSIONAL',
  CASUAL: 'CASUAL',
  HUMOROUS: 'HUMOROUS',
  SERIOUS: 'SERIOUS',
  SARCASTIC: 'SARCASTIC',
  EMPATHETIC: 'EMPATHETIC'
};

export type ToneStyle = (typeof ToneStyle)[keyof typeof ToneStyle]


export const ProfileVisibility: {
  PUBLIC: 'PUBLIC',
  FOLLOWERS_ONLY: 'FOLLOWERS_ONLY',
  PRIVATE: 'PRIVATE'
};

export type ProfileVisibility = (typeof ProfileVisibility)[keyof typeof ProfileVisibility]


export const Theme: {
  LIGHT: 'LIGHT',
  DARK: 'DARK',
  AUTO: 'AUTO'
};

export type Theme = (typeof Theme)[keyof typeof Theme]


export const NewsCategory: {
  POLITICS: 'POLITICS',
  BUSINESS: 'BUSINESS',
  TECHNOLOGY: 'TECHNOLOGY',
  SPORTS: 'SPORTS',
  ENTERTAINMENT: 'ENTERTAINMENT',
  HEALTH: 'HEALTH',
  SCIENCE: 'SCIENCE',
  WORLD: 'WORLD',
  LOCAL: 'LOCAL'
};

export type NewsCategory = (typeof NewsCategory)[keyof typeof NewsCategory]


export const NotificationCategory: {
  MENTIONS: 'MENTIONS',
  REPLIES: 'REPLIES',
  LIKES: 'LIKES',
  REPOSTS: 'REPOSTS',
  FOLLOWERS: 'FOLLOWERS',
  NEWS_ALERTS: 'NEWS_ALERTS',
  PERSONA_INTERACTIONS: 'PERSONA_INTERACTIONS'
};

export type NotificationCategory = (typeof NotificationCategory)[keyof typeof NotificationCategory]


export const ReactionType: {
  LIKE: 'LIKE',
  REPOST: 'REPOST',
  BOOKMARK: 'BOOKMARK',
  REPORT: 'REPORT'
};

export type ReactionType = (typeof ReactionType)[keyof typeof ReactionType]


export const TrendCategory: {
  BREAKING_NEWS: 'BREAKING_NEWS',
  POLITICS: 'POLITICS',
  ENTERTAINMENT: 'ENTERTAINMENT',
  SPORTS: 'SPORTS',
  TECHNOLOGY: 'TECHNOLOGY',
  MEME: 'MEME',
  HASHTAG_GAME: 'HASHTAG_GAME',
  OTHER: 'OTHER'
};

export type TrendCategory = (typeof TrendCategory)[keyof typeof TrendCategory]

}

export type PersonaType = $Enums.PersonaType

export const PersonaType: typeof $Enums.PersonaType

export type ToneStyle = $Enums.ToneStyle

export const ToneStyle: typeof $Enums.ToneStyle

export type ProfileVisibility = $Enums.ProfileVisibility

export const ProfileVisibility: typeof $Enums.ProfileVisibility

export type Theme = $Enums.Theme

export const Theme: typeof $Enums.Theme

export type NewsCategory = $Enums.NewsCategory

export const NewsCategory: typeof $Enums.NewsCategory

export type NotificationCategory = $Enums.NotificationCategory

export const NotificationCategory: typeof $Enums.NotificationCategory

export type ReactionType = $Enums.ReactionType

export const ReactionType: typeof $Enums.ReactionType

export type TrendCategory = $Enums.TrendCategory

export const TrendCategory: typeof $Enums.TrendCategory

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more UserAccounts
 * const userAccounts = await prisma.userAccount.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more UserAccounts
   * const userAccounts = await prisma.userAccount.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.userAccount`: Exposes CRUD operations for the **UserAccount** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserAccounts
    * const userAccounts = await prisma.userAccount.findMany()
    * ```
    */
  get userAccount(): Prisma.UserAccountDelegate<ExtArgs>;

  /**
   * `prisma.userProfile`: Exposes CRUD operations for the **UserProfile** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserProfiles
    * const userProfiles = await prisma.userProfile.findMany()
    * ```
    */
  get userProfile(): Prisma.UserProfileDelegate<ExtArgs>;

  /**
   * `prisma.politicalAlignment`: Exposes CRUD operations for the **PoliticalAlignment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PoliticalAlignments
    * const politicalAlignments = await prisma.politicalAlignment.findMany()
    * ```
    */
  get politicalAlignment(): Prisma.PoliticalAlignmentDelegate<ExtArgs>;

  /**
   * `prisma.influenceMetrics`: Exposes CRUD operations for the **InfluenceMetrics** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more InfluenceMetrics
    * const influenceMetrics = await prisma.influenceMetrics.findMany()
    * ```
    */
  get influenceMetrics(): Prisma.InfluenceMetricsDelegate<ExtArgs>;

  /**
   * `prisma.settings`: Exposes CRUD operations for the **Settings** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Settings
    * const settings = await prisma.settings.findMany()
    * ```
    */
  get settings(): Prisma.SettingsDelegate<ExtArgs>;

  /**
   * `prisma.post`: Exposes CRUD operations for the **Post** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Posts
    * const posts = await prisma.post.findMany()
    * ```
    */
  get post(): Prisma.PostDelegate<ExtArgs>;

  /**
   * `prisma.thread`: Exposes CRUD operations for the **Thread** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Threads
    * const threads = await prisma.thread.findMany()
    * ```
    */
  get thread(): Prisma.ThreadDelegate<ExtArgs>;

  /**
   * `prisma.reaction`: Exposes CRUD operations for the **Reaction** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Reactions
    * const reactions = await prisma.reaction.findMany()
    * ```
    */
  get reaction(): Prisma.ReactionDelegate<ExtArgs>;

  /**
   * `prisma.persona`: Exposes CRUD operations for the **Persona** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Personas
    * const personas = await prisma.persona.findMany()
    * ```
    */
  get persona(): Prisma.PersonaDelegate<ExtArgs>;

  /**
   * `prisma.newsItem`: Exposes CRUD operations for the **NewsItem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more NewsItems
    * const newsItems = await prisma.newsItem.findMany()
    * ```
    */
  get newsItem(): Prisma.NewsItemDelegate<ExtArgs>;

  /**
   * `prisma.trend`: Exposes CRUD operations for the **Trend** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Trends
    * const trends = await prisma.trend.findMany()
    * ```
    */
  get trend(): Prisma.TrendDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    UserAccount: 'UserAccount',
    UserProfile: 'UserProfile',
    PoliticalAlignment: 'PoliticalAlignment',
    InfluenceMetrics: 'InfluenceMetrics',
    Settings: 'Settings',
    Post: 'Post',
    Thread: 'Thread',
    Reaction: 'Reaction',
    Persona: 'Persona',
    NewsItem: 'NewsItem',
    Trend: 'Trend'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "userAccount" | "userProfile" | "politicalAlignment" | "influenceMetrics" | "settings" | "post" | "thread" | "reaction" | "persona" | "newsItem" | "trend"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      UserAccount: {
        payload: Prisma.$UserAccountPayload<ExtArgs>
        fields: Prisma.UserAccountFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserAccountFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAccountPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserAccountFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAccountPayload>
          }
          findFirst: {
            args: Prisma.UserAccountFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAccountPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserAccountFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAccountPayload>
          }
          findMany: {
            args: Prisma.UserAccountFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAccountPayload>[]
          }
          create: {
            args: Prisma.UserAccountCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAccountPayload>
          }
          createMany: {
            args: Prisma.UserAccountCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserAccountCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAccountPayload>[]
          }
          delete: {
            args: Prisma.UserAccountDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAccountPayload>
          }
          update: {
            args: Prisma.UserAccountUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAccountPayload>
          }
          deleteMany: {
            args: Prisma.UserAccountDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserAccountUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserAccountUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAccountPayload>
          }
          aggregate: {
            args: Prisma.UserAccountAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserAccount>
          }
          groupBy: {
            args: Prisma.UserAccountGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserAccountGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserAccountCountArgs<ExtArgs>
            result: $Utils.Optional<UserAccountCountAggregateOutputType> | number
          }
        }
      }
      UserProfile: {
        payload: Prisma.$UserProfilePayload<ExtArgs>
        fields: Prisma.UserProfileFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserProfileFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserProfileFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload>
          }
          findFirst: {
            args: Prisma.UserProfileFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserProfileFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload>
          }
          findMany: {
            args: Prisma.UserProfileFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload>[]
          }
          create: {
            args: Prisma.UserProfileCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload>
          }
          createMany: {
            args: Prisma.UserProfileCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserProfileCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload>[]
          }
          delete: {
            args: Prisma.UserProfileDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload>
          }
          update: {
            args: Prisma.UserProfileUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload>
          }
          deleteMany: {
            args: Prisma.UserProfileDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserProfileUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserProfileUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload>
          }
          aggregate: {
            args: Prisma.UserProfileAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserProfile>
          }
          groupBy: {
            args: Prisma.UserProfileGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserProfileGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserProfileCountArgs<ExtArgs>
            result: $Utils.Optional<UserProfileCountAggregateOutputType> | number
          }
        }
      }
      PoliticalAlignment: {
        payload: Prisma.$PoliticalAlignmentPayload<ExtArgs>
        fields: Prisma.PoliticalAlignmentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PoliticalAlignmentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PoliticalAlignmentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PoliticalAlignmentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PoliticalAlignmentPayload>
          }
          findFirst: {
            args: Prisma.PoliticalAlignmentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PoliticalAlignmentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PoliticalAlignmentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PoliticalAlignmentPayload>
          }
          findMany: {
            args: Prisma.PoliticalAlignmentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PoliticalAlignmentPayload>[]
          }
          create: {
            args: Prisma.PoliticalAlignmentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PoliticalAlignmentPayload>
          }
          createMany: {
            args: Prisma.PoliticalAlignmentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PoliticalAlignmentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PoliticalAlignmentPayload>[]
          }
          delete: {
            args: Prisma.PoliticalAlignmentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PoliticalAlignmentPayload>
          }
          update: {
            args: Prisma.PoliticalAlignmentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PoliticalAlignmentPayload>
          }
          deleteMany: {
            args: Prisma.PoliticalAlignmentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PoliticalAlignmentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PoliticalAlignmentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PoliticalAlignmentPayload>
          }
          aggregate: {
            args: Prisma.PoliticalAlignmentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePoliticalAlignment>
          }
          groupBy: {
            args: Prisma.PoliticalAlignmentGroupByArgs<ExtArgs>
            result: $Utils.Optional<PoliticalAlignmentGroupByOutputType>[]
          }
          count: {
            args: Prisma.PoliticalAlignmentCountArgs<ExtArgs>
            result: $Utils.Optional<PoliticalAlignmentCountAggregateOutputType> | number
          }
        }
      }
      InfluenceMetrics: {
        payload: Prisma.$InfluenceMetricsPayload<ExtArgs>
        fields: Prisma.InfluenceMetricsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InfluenceMetricsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InfluenceMetricsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InfluenceMetricsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InfluenceMetricsPayload>
          }
          findFirst: {
            args: Prisma.InfluenceMetricsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InfluenceMetricsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InfluenceMetricsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InfluenceMetricsPayload>
          }
          findMany: {
            args: Prisma.InfluenceMetricsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InfluenceMetricsPayload>[]
          }
          create: {
            args: Prisma.InfluenceMetricsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InfluenceMetricsPayload>
          }
          createMany: {
            args: Prisma.InfluenceMetricsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.InfluenceMetricsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InfluenceMetricsPayload>[]
          }
          delete: {
            args: Prisma.InfluenceMetricsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InfluenceMetricsPayload>
          }
          update: {
            args: Prisma.InfluenceMetricsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InfluenceMetricsPayload>
          }
          deleteMany: {
            args: Prisma.InfluenceMetricsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InfluenceMetricsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.InfluenceMetricsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InfluenceMetricsPayload>
          }
          aggregate: {
            args: Prisma.InfluenceMetricsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInfluenceMetrics>
          }
          groupBy: {
            args: Prisma.InfluenceMetricsGroupByArgs<ExtArgs>
            result: $Utils.Optional<InfluenceMetricsGroupByOutputType>[]
          }
          count: {
            args: Prisma.InfluenceMetricsCountArgs<ExtArgs>
            result: $Utils.Optional<InfluenceMetricsCountAggregateOutputType> | number
          }
        }
      }
      Settings: {
        payload: Prisma.$SettingsPayload<ExtArgs>
        fields: Prisma.SettingsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SettingsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SettingsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingsPayload>
          }
          findFirst: {
            args: Prisma.SettingsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SettingsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingsPayload>
          }
          findMany: {
            args: Prisma.SettingsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingsPayload>[]
          }
          create: {
            args: Prisma.SettingsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingsPayload>
          }
          createMany: {
            args: Prisma.SettingsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SettingsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingsPayload>[]
          }
          delete: {
            args: Prisma.SettingsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingsPayload>
          }
          update: {
            args: Prisma.SettingsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingsPayload>
          }
          deleteMany: {
            args: Prisma.SettingsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SettingsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SettingsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingsPayload>
          }
          aggregate: {
            args: Prisma.SettingsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSettings>
          }
          groupBy: {
            args: Prisma.SettingsGroupByArgs<ExtArgs>
            result: $Utils.Optional<SettingsGroupByOutputType>[]
          }
          count: {
            args: Prisma.SettingsCountArgs<ExtArgs>
            result: $Utils.Optional<SettingsCountAggregateOutputType> | number
          }
        }
      }
      Post: {
        payload: Prisma.$PostPayload<ExtArgs>
        fields: Prisma.PostFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PostFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PostFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>
          }
          findFirst: {
            args: Prisma.PostFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PostFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>
          }
          findMany: {
            args: Prisma.PostFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>[]
          }
          create: {
            args: Prisma.PostCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>
          }
          createMany: {
            args: Prisma.PostCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PostCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>[]
          }
          delete: {
            args: Prisma.PostDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>
          }
          update: {
            args: Prisma.PostUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>
          }
          deleteMany: {
            args: Prisma.PostDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PostUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PostUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>
          }
          aggregate: {
            args: Prisma.PostAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePost>
          }
          groupBy: {
            args: Prisma.PostGroupByArgs<ExtArgs>
            result: $Utils.Optional<PostGroupByOutputType>[]
          }
          count: {
            args: Prisma.PostCountArgs<ExtArgs>
            result: $Utils.Optional<PostCountAggregateOutputType> | number
          }
        }
      }
      Thread: {
        payload: Prisma.$ThreadPayload<ExtArgs>
        fields: Prisma.ThreadFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ThreadFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThreadPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ThreadFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThreadPayload>
          }
          findFirst: {
            args: Prisma.ThreadFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThreadPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ThreadFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThreadPayload>
          }
          findMany: {
            args: Prisma.ThreadFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThreadPayload>[]
          }
          create: {
            args: Prisma.ThreadCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThreadPayload>
          }
          createMany: {
            args: Prisma.ThreadCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ThreadCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThreadPayload>[]
          }
          delete: {
            args: Prisma.ThreadDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThreadPayload>
          }
          update: {
            args: Prisma.ThreadUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThreadPayload>
          }
          deleteMany: {
            args: Prisma.ThreadDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ThreadUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ThreadUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThreadPayload>
          }
          aggregate: {
            args: Prisma.ThreadAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateThread>
          }
          groupBy: {
            args: Prisma.ThreadGroupByArgs<ExtArgs>
            result: $Utils.Optional<ThreadGroupByOutputType>[]
          }
          count: {
            args: Prisma.ThreadCountArgs<ExtArgs>
            result: $Utils.Optional<ThreadCountAggregateOutputType> | number
          }
        }
      }
      Reaction: {
        payload: Prisma.$ReactionPayload<ExtArgs>
        fields: Prisma.ReactionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ReactionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReactionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ReactionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReactionPayload>
          }
          findFirst: {
            args: Prisma.ReactionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReactionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ReactionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReactionPayload>
          }
          findMany: {
            args: Prisma.ReactionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReactionPayload>[]
          }
          create: {
            args: Prisma.ReactionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReactionPayload>
          }
          createMany: {
            args: Prisma.ReactionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ReactionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReactionPayload>[]
          }
          delete: {
            args: Prisma.ReactionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReactionPayload>
          }
          update: {
            args: Prisma.ReactionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReactionPayload>
          }
          deleteMany: {
            args: Prisma.ReactionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ReactionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ReactionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReactionPayload>
          }
          aggregate: {
            args: Prisma.ReactionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateReaction>
          }
          groupBy: {
            args: Prisma.ReactionGroupByArgs<ExtArgs>
            result: $Utils.Optional<ReactionGroupByOutputType>[]
          }
          count: {
            args: Prisma.ReactionCountArgs<ExtArgs>
            result: $Utils.Optional<ReactionCountAggregateOutputType> | number
          }
        }
      }
      Persona: {
        payload: Prisma.$PersonaPayload<ExtArgs>
        fields: Prisma.PersonaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PersonaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PersonaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PersonaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PersonaPayload>
          }
          findFirst: {
            args: Prisma.PersonaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PersonaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PersonaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PersonaPayload>
          }
          findMany: {
            args: Prisma.PersonaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PersonaPayload>[]
          }
          create: {
            args: Prisma.PersonaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PersonaPayload>
          }
          createMany: {
            args: Prisma.PersonaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PersonaCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PersonaPayload>[]
          }
          delete: {
            args: Prisma.PersonaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PersonaPayload>
          }
          update: {
            args: Prisma.PersonaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PersonaPayload>
          }
          deleteMany: {
            args: Prisma.PersonaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PersonaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PersonaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PersonaPayload>
          }
          aggregate: {
            args: Prisma.PersonaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePersona>
          }
          groupBy: {
            args: Prisma.PersonaGroupByArgs<ExtArgs>
            result: $Utils.Optional<PersonaGroupByOutputType>[]
          }
          count: {
            args: Prisma.PersonaCountArgs<ExtArgs>
            result: $Utils.Optional<PersonaCountAggregateOutputType> | number
          }
        }
      }
      NewsItem: {
        payload: Prisma.$NewsItemPayload<ExtArgs>
        fields: Prisma.NewsItemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NewsItemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsItemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NewsItemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsItemPayload>
          }
          findFirst: {
            args: Prisma.NewsItemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsItemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NewsItemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsItemPayload>
          }
          findMany: {
            args: Prisma.NewsItemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsItemPayload>[]
          }
          create: {
            args: Prisma.NewsItemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsItemPayload>
          }
          createMany: {
            args: Prisma.NewsItemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.NewsItemCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsItemPayload>[]
          }
          delete: {
            args: Prisma.NewsItemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsItemPayload>
          }
          update: {
            args: Prisma.NewsItemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsItemPayload>
          }
          deleteMany: {
            args: Prisma.NewsItemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NewsItemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.NewsItemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsItemPayload>
          }
          aggregate: {
            args: Prisma.NewsItemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNewsItem>
          }
          groupBy: {
            args: Prisma.NewsItemGroupByArgs<ExtArgs>
            result: $Utils.Optional<NewsItemGroupByOutputType>[]
          }
          count: {
            args: Prisma.NewsItemCountArgs<ExtArgs>
            result: $Utils.Optional<NewsItemCountAggregateOutputType> | number
          }
        }
      }
      Trend: {
        payload: Prisma.$TrendPayload<ExtArgs>
        fields: Prisma.TrendFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TrendFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrendPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TrendFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrendPayload>
          }
          findFirst: {
            args: Prisma.TrendFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrendPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TrendFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrendPayload>
          }
          findMany: {
            args: Prisma.TrendFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrendPayload>[]
          }
          create: {
            args: Prisma.TrendCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrendPayload>
          }
          createMany: {
            args: Prisma.TrendCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TrendCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrendPayload>[]
          }
          delete: {
            args: Prisma.TrendDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrendPayload>
          }
          update: {
            args: Prisma.TrendUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrendPayload>
          }
          deleteMany: {
            args: Prisma.TrendDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TrendUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TrendUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrendPayload>
          }
          aggregate: {
            args: Prisma.TrendAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTrend>
          }
          groupBy: {
            args: Prisma.TrendGroupByArgs<ExtArgs>
            result: $Utils.Optional<TrendGroupByOutputType>[]
          }
          count: {
            args: Prisma.TrendCountArgs<ExtArgs>
            result: $Utils.Optional<TrendCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserAccountCountOutputType
   */

  export type UserAccountCountOutputType = {
    posts: number
    reactions: number
  }

  export type UserAccountCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    posts?: boolean | UserAccountCountOutputTypeCountPostsArgs
    reactions?: boolean | UserAccountCountOutputTypeCountReactionsArgs
  }

  // Custom InputTypes
  /**
   * UserAccountCountOutputType without action
   */
  export type UserAccountCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAccountCountOutputType
     */
    select?: UserAccountCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserAccountCountOutputType without action
   */
  export type UserAccountCountOutputTypeCountPostsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PostWhereInput
  }

  /**
   * UserAccountCountOutputType without action
   */
  export type UserAccountCountOutputTypeCountReactionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReactionWhereInput
  }


  /**
   * Count Type PoliticalAlignmentCountOutputType
   */

  export type PoliticalAlignmentCountOutputType = {
    personas: number
  }

  export type PoliticalAlignmentCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    personas?: boolean | PoliticalAlignmentCountOutputTypeCountPersonasArgs
  }

  // Custom InputTypes
  /**
   * PoliticalAlignmentCountOutputType without action
   */
  export type PoliticalAlignmentCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PoliticalAlignmentCountOutputType
     */
    select?: PoliticalAlignmentCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PoliticalAlignmentCountOutputType without action
   */
  export type PoliticalAlignmentCountOutputTypeCountPersonasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PersonaWhereInput
  }


  /**
   * Count Type PostCountOutputType
   */

  export type PostCountOutputType = {
    replies: number
    reposts: number
    reactions: number
  }

  export type PostCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    replies?: boolean | PostCountOutputTypeCountRepliesArgs
    reposts?: boolean | PostCountOutputTypeCountRepostsArgs
    reactions?: boolean | PostCountOutputTypeCountReactionsArgs
  }

  // Custom InputTypes
  /**
   * PostCountOutputType without action
   */
  export type PostCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PostCountOutputType
     */
    select?: PostCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PostCountOutputType without action
   */
  export type PostCountOutputTypeCountRepliesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PostWhereInput
  }

  /**
   * PostCountOutputType without action
   */
  export type PostCountOutputTypeCountRepostsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PostWhereInput
  }

  /**
   * PostCountOutputType without action
   */
  export type PostCountOutputTypeCountReactionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReactionWhereInput
  }


  /**
   * Count Type ThreadCountOutputType
   */

  export type ThreadCountOutputType = {
    posts: number
  }

  export type ThreadCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    posts?: boolean | ThreadCountOutputTypeCountPostsArgs
  }

  // Custom InputTypes
  /**
   * ThreadCountOutputType without action
   */
  export type ThreadCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ThreadCountOutputType
     */
    select?: ThreadCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ThreadCountOutputType without action
   */
  export type ThreadCountOutputTypeCountPostsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PostWhereInput
  }


  /**
   * Count Type PersonaCountOutputType
   */

  export type PersonaCountOutputType = {
    posts: number
  }

  export type PersonaCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    posts?: boolean | PersonaCountOutputTypeCountPostsArgs
  }

  // Custom InputTypes
  /**
   * PersonaCountOutputType without action
   */
  export type PersonaCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PersonaCountOutputType
     */
    select?: PersonaCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PersonaCountOutputType without action
   */
  export type PersonaCountOutputTypeCountPostsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PostWhereInput
  }


  /**
   * Count Type NewsItemCountOutputType
   */

  export type NewsItemCountOutputType = {
    trends: number
    relatedPosts: number
  }

  export type NewsItemCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    trends?: boolean | NewsItemCountOutputTypeCountTrendsArgs
    relatedPosts?: boolean | NewsItemCountOutputTypeCountRelatedPostsArgs
  }

  // Custom InputTypes
  /**
   * NewsItemCountOutputType without action
   */
  export type NewsItemCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsItemCountOutputType
     */
    select?: NewsItemCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * NewsItemCountOutputType without action
   */
  export type NewsItemCountOutputTypeCountTrendsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TrendWhereInput
  }

  /**
   * NewsItemCountOutputType without action
   */
  export type NewsItemCountOutputTypeCountRelatedPostsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PostWhereInput
  }


  /**
   * Count Type TrendCountOutputType
   */

  export type TrendCountOutputType = {
    newsItems: number
  }

  export type TrendCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    newsItems?: boolean | TrendCountOutputTypeCountNewsItemsArgs
  }

  // Custom InputTypes
  /**
   * TrendCountOutputType without action
   */
  export type TrendCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrendCountOutputType
     */
    select?: TrendCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TrendCountOutputType without action
   */
  export type TrendCountOutputTypeCountNewsItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NewsItemWhereInput
  }


  /**
   * Models
   */

  /**
   * Model UserAccount
   */

  export type AggregateUserAccount = {
    _count: UserAccountCountAggregateOutputType | null
    _min: UserAccountMinAggregateOutputType | null
    _max: UserAccountMaxAggregateOutputType | null
  }

  export type UserAccountMinAggregateOutputType = {
    id: string | null
    username: string | null
    email: string | null
    passwordHash: string | null
    emailVerified: boolean | null
    isActive: boolean | null
    lastLoginAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserAccountMaxAggregateOutputType = {
    id: string | null
    username: string | null
    email: string | null
    passwordHash: string | null
    emailVerified: boolean | null
    isActive: boolean | null
    lastLoginAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserAccountCountAggregateOutputType = {
    id: number
    username: number
    email: number
    passwordHash: number
    emailVerified: number
    isActive: number
    lastLoginAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserAccountMinAggregateInputType = {
    id?: true
    username?: true
    email?: true
    passwordHash?: true
    emailVerified?: true
    isActive?: true
    lastLoginAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserAccountMaxAggregateInputType = {
    id?: true
    username?: true
    email?: true
    passwordHash?: true
    emailVerified?: true
    isActive?: true
    lastLoginAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserAccountCountAggregateInputType = {
    id?: true
    username?: true
    email?: true
    passwordHash?: true
    emailVerified?: true
    isActive?: true
    lastLoginAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAccountAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserAccount to aggregate.
     */
    where?: UserAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserAccounts to fetch.
     */
    orderBy?: UserAccountOrderByWithRelationInput | UserAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserAccounts
    **/
    _count?: true | UserAccountCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserAccountMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserAccountMaxAggregateInputType
  }

  export type GetUserAccountAggregateType<T extends UserAccountAggregateArgs> = {
        [P in keyof T & keyof AggregateUserAccount]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserAccount[P]>
      : GetScalarType<T[P], AggregateUserAccount[P]>
  }




  export type UserAccountGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserAccountWhereInput
    orderBy?: UserAccountOrderByWithAggregationInput | UserAccountOrderByWithAggregationInput[]
    by: UserAccountScalarFieldEnum[] | UserAccountScalarFieldEnum
    having?: UserAccountScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserAccountCountAggregateInputType | true
    _min?: UserAccountMinAggregateInputType
    _max?: UserAccountMaxAggregateInputType
  }

  export type UserAccountGroupByOutputType = {
    id: string
    username: string
    email: string
    passwordHash: string
    emailVerified: boolean
    isActive: boolean
    lastLoginAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: UserAccountCountAggregateOutputType | null
    _min: UserAccountMinAggregateOutputType | null
    _max: UserAccountMaxAggregateOutputType | null
  }

  type GetUserAccountGroupByPayload<T extends UserAccountGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserAccountGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserAccountGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserAccountGroupByOutputType[P]>
            : GetScalarType<T[P], UserAccountGroupByOutputType[P]>
        }
      >
    >


  export type UserAccountSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    email?: boolean
    passwordHash?: boolean
    emailVerified?: boolean
    isActive?: boolean
    lastLoginAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    profile?: boolean | UserAccount$profileArgs<ExtArgs>
    politicalAlignment?: boolean | UserAccount$politicalAlignmentArgs<ExtArgs>
    influenceMetrics?: boolean | UserAccount$influenceMetricsArgs<ExtArgs>
    settings?: boolean | UserAccount$settingsArgs<ExtArgs>
    posts?: boolean | UserAccount$postsArgs<ExtArgs>
    reactions?: boolean | UserAccount$reactionsArgs<ExtArgs>
    _count?: boolean | UserAccountCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userAccount"]>

  export type UserAccountSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    email?: boolean
    passwordHash?: boolean
    emailVerified?: boolean
    isActive?: boolean
    lastLoginAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["userAccount"]>

  export type UserAccountSelectScalar = {
    id?: boolean
    username?: boolean
    email?: boolean
    passwordHash?: boolean
    emailVerified?: boolean
    isActive?: boolean
    lastLoginAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserAccountInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    profile?: boolean | UserAccount$profileArgs<ExtArgs>
    politicalAlignment?: boolean | UserAccount$politicalAlignmentArgs<ExtArgs>
    influenceMetrics?: boolean | UserAccount$influenceMetricsArgs<ExtArgs>
    settings?: boolean | UserAccount$settingsArgs<ExtArgs>
    posts?: boolean | UserAccount$postsArgs<ExtArgs>
    reactions?: boolean | UserAccount$reactionsArgs<ExtArgs>
    _count?: boolean | UserAccountCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserAccountIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserAccountPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserAccount"
    objects: {
      profile: Prisma.$UserProfilePayload<ExtArgs> | null
      politicalAlignment: Prisma.$PoliticalAlignmentPayload<ExtArgs> | null
      influenceMetrics: Prisma.$InfluenceMetricsPayload<ExtArgs> | null
      settings: Prisma.$SettingsPayload<ExtArgs> | null
      posts: Prisma.$PostPayload<ExtArgs>[]
      reactions: Prisma.$ReactionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      username: string
      email: string
      passwordHash: string
      emailVerified: boolean
      isActive: boolean
      lastLoginAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["userAccount"]>
    composites: {}
  }

  type UserAccountGetPayload<S extends boolean | null | undefined | UserAccountDefaultArgs> = $Result.GetResult<Prisma.$UserAccountPayload, S>

  type UserAccountCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserAccountFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserAccountCountAggregateInputType | true
    }

  export interface UserAccountDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserAccount'], meta: { name: 'UserAccount' } }
    /**
     * Find zero or one UserAccount that matches the filter.
     * @param {UserAccountFindUniqueArgs} args - Arguments to find a UserAccount
     * @example
     * // Get one UserAccount
     * const userAccount = await prisma.userAccount.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserAccountFindUniqueArgs>(args: SelectSubset<T, UserAccountFindUniqueArgs<ExtArgs>>): Prisma__UserAccountClient<$Result.GetResult<Prisma.$UserAccountPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one UserAccount that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UserAccountFindUniqueOrThrowArgs} args - Arguments to find a UserAccount
     * @example
     * // Get one UserAccount
     * const userAccount = await prisma.userAccount.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserAccountFindUniqueOrThrowArgs>(args: SelectSubset<T, UserAccountFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserAccountClient<$Result.GetResult<Prisma.$UserAccountPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first UserAccount that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAccountFindFirstArgs} args - Arguments to find a UserAccount
     * @example
     * // Get one UserAccount
     * const userAccount = await prisma.userAccount.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserAccountFindFirstArgs>(args?: SelectSubset<T, UserAccountFindFirstArgs<ExtArgs>>): Prisma__UserAccountClient<$Result.GetResult<Prisma.$UserAccountPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first UserAccount that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAccountFindFirstOrThrowArgs} args - Arguments to find a UserAccount
     * @example
     * // Get one UserAccount
     * const userAccount = await prisma.userAccount.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserAccountFindFirstOrThrowArgs>(args?: SelectSubset<T, UserAccountFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserAccountClient<$Result.GetResult<Prisma.$UserAccountPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more UserAccounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAccountFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserAccounts
     * const userAccounts = await prisma.userAccount.findMany()
     * 
     * // Get first 10 UserAccounts
     * const userAccounts = await prisma.userAccount.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userAccountWithIdOnly = await prisma.userAccount.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserAccountFindManyArgs>(args?: SelectSubset<T, UserAccountFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserAccountPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a UserAccount.
     * @param {UserAccountCreateArgs} args - Arguments to create a UserAccount.
     * @example
     * // Create one UserAccount
     * const UserAccount = await prisma.userAccount.create({
     *   data: {
     *     // ... data to create a UserAccount
     *   }
     * })
     * 
     */
    create<T extends UserAccountCreateArgs>(args: SelectSubset<T, UserAccountCreateArgs<ExtArgs>>): Prisma__UserAccountClient<$Result.GetResult<Prisma.$UserAccountPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many UserAccounts.
     * @param {UserAccountCreateManyArgs} args - Arguments to create many UserAccounts.
     * @example
     * // Create many UserAccounts
     * const userAccount = await prisma.userAccount.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserAccountCreateManyArgs>(args?: SelectSubset<T, UserAccountCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserAccounts and returns the data saved in the database.
     * @param {UserAccountCreateManyAndReturnArgs} args - Arguments to create many UserAccounts.
     * @example
     * // Create many UserAccounts
     * const userAccount = await prisma.userAccount.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserAccounts and only return the `id`
     * const userAccountWithIdOnly = await prisma.userAccount.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserAccountCreateManyAndReturnArgs>(args?: SelectSubset<T, UserAccountCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserAccountPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a UserAccount.
     * @param {UserAccountDeleteArgs} args - Arguments to delete one UserAccount.
     * @example
     * // Delete one UserAccount
     * const UserAccount = await prisma.userAccount.delete({
     *   where: {
     *     // ... filter to delete one UserAccount
     *   }
     * })
     * 
     */
    delete<T extends UserAccountDeleteArgs>(args: SelectSubset<T, UserAccountDeleteArgs<ExtArgs>>): Prisma__UserAccountClient<$Result.GetResult<Prisma.$UserAccountPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one UserAccount.
     * @param {UserAccountUpdateArgs} args - Arguments to update one UserAccount.
     * @example
     * // Update one UserAccount
     * const userAccount = await prisma.userAccount.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserAccountUpdateArgs>(args: SelectSubset<T, UserAccountUpdateArgs<ExtArgs>>): Prisma__UserAccountClient<$Result.GetResult<Prisma.$UserAccountPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more UserAccounts.
     * @param {UserAccountDeleteManyArgs} args - Arguments to filter UserAccounts to delete.
     * @example
     * // Delete a few UserAccounts
     * const { count } = await prisma.userAccount.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserAccountDeleteManyArgs>(args?: SelectSubset<T, UserAccountDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserAccounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAccountUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserAccounts
     * const userAccount = await prisma.userAccount.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserAccountUpdateManyArgs>(args: SelectSubset<T, UserAccountUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one UserAccount.
     * @param {UserAccountUpsertArgs} args - Arguments to update or create a UserAccount.
     * @example
     * // Update or create a UserAccount
     * const userAccount = await prisma.userAccount.upsert({
     *   create: {
     *     // ... data to create a UserAccount
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserAccount we want to update
     *   }
     * })
     */
    upsert<T extends UserAccountUpsertArgs>(args: SelectSubset<T, UserAccountUpsertArgs<ExtArgs>>): Prisma__UserAccountClient<$Result.GetResult<Prisma.$UserAccountPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of UserAccounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAccountCountArgs} args - Arguments to filter UserAccounts to count.
     * @example
     * // Count the number of UserAccounts
     * const count = await prisma.userAccount.count({
     *   where: {
     *     // ... the filter for the UserAccounts we want to count
     *   }
     * })
    **/
    count<T extends UserAccountCountArgs>(
      args?: Subset<T, UserAccountCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserAccountCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserAccount.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAccountAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAccountAggregateArgs>(args: Subset<T, UserAccountAggregateArgs>): Prisma.PrismaPromise<GetUserAccountAggregateType<T>>

    /**
     * Group by UserAccount.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAccountGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserAccountGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserAccountGroupByArgs['orderBy'] }
        : { orderBy?: UserAccountGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserAccountGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserAccountGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserAccount model
   */
  readonly fields: UserAccountFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserAccount.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserAccountClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    profile<T extends UserAccount$profileArgs<ExtArgs> = {}>(args?: Subset<T, UserAccount$profileArgs<ExtArgs>>): Prisma__UserProfileClient<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    politicalAlignment<T extends UserAccount$politicalAlignmentArgs<ExtArgs> = {}>(args?: Subset<T, UserAccount$politicalAlignmentArgs<ExtArgs>>): Prisma__PoliticalAlignmentClient<$Result.GetResult<Prisma.$PoliticalAlignmentPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    influenceMetrics<T extends UserAccount$influenceMetricsArgs<ExtArgs> = {}>(args?: Subset<T, UserAccount$influenceMetricsArgs<ExtArgs>>): Prisma__InfluenceMetricsClient<$Result.GetResult<Prisma.$InfluenceMetricsPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    settings<T extends UserAccount$settingsArgs<ExtArgs> = {}>(args?: Subset<T, UserAccount$settingsArgs<ExtArgs>>): Prisma__SettingsClient<$Result.GetResult<Prisma.$SettingsPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    posts<T extends UserAccount$postsArgs<ExtArgs> = {}>(args?: Subset<T, UserAccount$postsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findMany"> | Null>
    reactions<T extends UserAccount$reactionsArgs<ExtArgs> = {}>(args?: Subset<T, UserAccount$reactionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReactionPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UserAccount model
   */ 
  interface UserAccountFieldRefs {
    readonly id: FieldRef<"UserAccount", 'String'>
    readonly username: FieldRef<"UserAccount", 'String'>
    readonly email: FieldRef<"UserAccount", 'String'>
    readonly passwordHash: FieldRef<"UserAccount", 'String'>
    readonly emailVerified: FieldRef<"UserAccount", 'Boolean'>
    readonly isActive: FieldRef<"UserAccount", 'Boolean'>
    readonly lastLoginAt: FieldRef<"UserAccount", 'DateTime'>
    readonly createdAt: FieldRef<"UserAccount", 'DateTime'>
    readonly updatedAt: FieldRef<"UserAccount", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UserAccount findUnique
   */
  export type UserAccountFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAccount
     */
    select?: UserAccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAccountInclude<ExtArgs> | null
    /**
     * Filter, which UserAccount to fetch.
     */
    where: UserAccountWhereUniqueInput
  }

  /**
   * UserAccount findUniqueOrThrow
   */
  export type UserAccountFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAccount
     */
    select?: UserAccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAccountInclude<ExtArgs> | null
    /**
     * Filter, which UserAccount to fetch.
     */
    where: UserAccountWhereUniqueInput
  }

  /**
   * UserAccount findFirst
   */
  export type UserAccountFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAccount
     */
    select?: UserAccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAccountInclude<ExtArgs> | null
    /**
     * Filter, which UserAccount to fetch.
     */
    where?: UserAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserAccounts to fetch.
     */
    orderBy?: UserAccountOrderByWithRelationInput | UserAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserAccounts.
     */
    cursor?: UserAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserAccounts.
     */
    distinct?: UserAccountScalarFieldEnum | UserAccountScalarFieldEnum[]
  }

  /**
   * UserAccount findFirstOrThrow
   */
  export type UserAccountFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAccount
     */
    select?: UserAccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAccountInclude<ExtArgs> | null
    /**
     * Filter, which UserAccount to fetch.
     */
    where?: UserAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserAccounts to fetch.
     */
    orderBy?: UserAccountOrderByWithRelationInput | UserAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserAccounts.
     */
    cursor?: UserAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserAccounts.
     */
    distinct?: UserAccountScalarFieldEnum | UserAccountScalarFieldEnum[]
  }

  /**
   * UserAccount findMany
   */
  export type UserAccountFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAccount
     */
    select?: UserAccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAccountInclude<ExtArgs> | null
    /**
     * Filter, which UserAccounts to fetch.
     */
    where?: UserAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserAccounts to fetch.
     */
    orderBy?: UserAccountOrderByWithRelationInput | UserAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserAccounts.
     */
    cursor?: UserAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserAccounts.
     */
    skip?: number
    distinct?: UserAccountScalarFieldEnum | UserAccountScalarFieldEnum[]
  }

  /**
   * UserAccount create
   */
  export type UserAccountCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAccount
     */
    select?: UserAccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAccountInclude<ExtArgs> | null
    /**
     * The data needed to create a UserAccount.
     */
    data: XOR<UserAccountCreateInput, UserAccountUncheckedCreateInput>
  }

  /**
   * UserAccount createMany
   */
  export type UserAccountCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserAccounts.
     */
    data: UserAccountCreateManyInput | UserAccountCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserAccount createManyAndReturn
   */
  export type UserAccountCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAccount
     */
    select?: UserAccountSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many UserAccounts.
     */
    data: UserAccountCreateManyInput | UserAccountCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserAccount update
   */
  export type UserAccountUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAccount
     */
    select?: UserAccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAccountInclude<ExtArgs> | null
    /**
     * The data needed to update a UserAccount.
     */
    data: XOR<UserAccountUpdateInput, UserAccountUncheckedUpdateInput>
    /**
     * Choose, which UserAccount to update.
     */
    where: UserAccountWhereUniqueInput
  }

  /**
   * UserAccount updateMany
   */
  export type UserAccountUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserAccounts.
     */
    data: XOR<UserAccountUpdateManyMutationInput, UserAccountUncheckedUpdateManyInput>
    /**
     * Filter which UserAccounts to update
     */
    where?: UserAccountWhereInput
  }

  /**
   * UserAccount upsert
   */
  export type UserAccountUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAccount
     */
    select?: UserAccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAccountInclude<ExtArgs> | null
    /**
     * The filter to search for the UserAccount to update in case it exists.
     */
    where: UserAccountWhereUniqueInput
    /**
     * In case the UserAccount found by the `where` argument doesn't exist, create a new UserAccount with this data.
     */
    create: XOR<UserAccountCreateInput, UserAccountUncheckedCreateInput>
    /**
     * In case the UserAccount was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserAccountUpdateInput, UserAccountUncheckedUpdateInput>
  }

  /**
   * UserAccount delete
   */
  export type UserAccountDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAccount
     */
    select?: UserAccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAccountInclude<ExtArgs> | null
    /**
     * Filter which UserAccount to delete.
     */
    where: UserAccountWhereUniqueInput
  }

  /**
   * UserAccount deleteMany
   */
  export type UserAccountDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserAccounts to delete
     */
    where?: UserAccountWhereInput
  }

  /**
   * UserAccount.profile
   */
  export type UserAccount$profileArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileInclude<ExtArgs> | null
    where?: UserProfileWhereInput
  }

  /**
   * UserAccount.politicalAlignment
   */
  export type UserAccount$politicalAlignmentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PoliticalAlignment
     */
    select?: PoliticalAlignmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PoliticalAlignmentInclude<ExtArgs> | null
    where?: PoliticalAlignmentWhereInput
  }

  /**
   * UserAccount.influenceMetrics
   */
  export type UserAccount$influenceMetricsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InfluenceMetrics
     */
    select?: InfluenceMetricsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InfluenceMetricsInclude<ExtArgs> | null
    where?: InfluenceMetricsWhereInput
  }

  /**
   * UserAccount.settings
   */
  export type UserAccount$settingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Settings
     */
    select?: SettingsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SettingsInclude<ExtArgs> | null
    where?: SettingsWhereInput
  }

  /**
   * UserAccount.posts
   */
  export type UserAccount$postsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    where?: PostWhereInput
    orderBy?: PostOrderByWithRelationInput | PostOrderByWithRelationInput[]
    cursor?: PostWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PostScalarFieldEnum | PostScalarFieldEnum[]
  }

  /**
   * UserAccount.reactions
   */
  export type UserAccount$reactionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reaction
     */
    select?: ReactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReactionInclude<ExtArgs> | null
    where?: ReactionWhereInput
    orderBy?: ReactionOrderByWithRelationInput | ReactionOrderByWithRelationInput[]
    cursor?: ReactionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReactionScalarFieldEnum | ReactionScalarFieldEnum[]
  }

  /**
   * UserAccount without action
   */
  export type UserAccountDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAccount
     */
    select?: UserAccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAccountInclude<ExtArgs> | null
  }


  /**
   * Model UserProfile
   */

  export type AggregateUserProfile = {
    _count: UserProfileCountAggregateOutputType | null
    _avg: UserProfileAvgAggregateOutputType | null
    _sum: UserProfileSumAggregateOutputType | null
    _min: UserProfileMinAggregateOutputType | null
    _max: UserProfileMaxAggregateOutputType | null
  }

  export type UserProfileAvgAggregateOutputType = {
    followerCount: number | null
    followingCount: number | null
    postCount: number | null
  }

  export type UserProfileSumAggregateOutputType = {
    followerCount: number | null
    followingCount: number | null
    postCount: number | null
  }

  export type UserProfileMinAggregateOutputType = {
    id: string | null
    userId: string | null
    displayName: string | null
    bio: string | null
    profileImageUrl: string | null
    headerImageUrl: string | null
    location: string | null
    website: string | null
    personaType: $Enums.PersonaType | null
    verificationBadge: boolean | null
    followerCount: number | null
    followingCount: number | null
    postCount: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserProfileMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    displayName: string | null
    bio: string | null
    profileImageUrl: string | null
    headerImageUrl: string | null
    location: string | null
    website: string | null
    personaType: $Enums.PersonaType | null
    verificationBadge: boolean | null
    followerCount: number | null
    followingCount: number | null
    postCount: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserProfileCountAggregateOutputType = {
    id: number
    userId: number
    displayName: number
    bio: number
    profileImageUrl: number
    headerImageUrl: number
    location: number
    website: number
    personaType: number
    specialtyAreas: number
    verificationBadge: number
    followerCount: number
    followingCount: number
    postCount: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserProfileAvgAggregateInputType = {
    followerCount?: true
    followingCount?: true
    postCount?: true
  }

  export type UserProfileSumAggregateInputType = {
    followerCount?: true
    followingCount?: true
    postCount?: true
  }

  export type UserProfileMinAggregateInputType = {
    id?: true
    userId?: true
    displayName?: true
    bio?: true
    profileImageUrl?: true
    headerImageUrl?: true
    location?: true
    website?: true
    personaType?: true
    verificationBadge?: true
    followerCount?: true
    followingCount?: true
    postCount?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserProfileMaxAggregateInputType = {
    id?: true
    userId?: true
    displayName?: true
    bio?: true
    profileImageUrl?: true
    headerImageUrl?: true
    location?: true
    website?: true
    personaType?: true
    verificationBadge?: true
    followerCount?: true
    followingCount?: true
    postCount?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserProfileCountAggregateInputType = {
    id?: true
    userId?: true
    displayName?: true
    bio?: true
    profileImageUrl?: true
    headerImageUrl?: true
    location?: true
    website?: true
    personaType?: true
    specialtyAreas?: true
    verificationBadge?: true
    followerCount?: true
    followingCount?: true
    postCount?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserProfileAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserProfile to aggregate.
     */
    where?: UserProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserProfiles to fetch.
     */
    orderBy?: UserProfileOrderByWithRelationInput | UserProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserProfiles
    **/
    _count?: true | UserProfileCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserProfileAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserProfileSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserProfileMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserProfileMaxAggregateInputType
  }

  export type GetUserProfileAggregateType<T extends UserProfileAggregateArgs> = {
        [P in keyof T & keyof AggregateUserProfile]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserProfile[P]>
      : GetScalarType<T[P], AggregateUserProfile[P]>
  }




  export type UserProfileGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserProfileWhereInput
    orderBy?: UserProfileOrderByWithAggregationInput | UserProfileOrderByWithAggregationInput[]
    by: UserProfileScalarFieldEnum[] | UserProfileScalarFieldEnum
    having?: UserProfileScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserProfileCountAggregateInputType | true
    _avg?: UserProfileAvgAggregateInputType
    _sum?: UserProfileSumAggregateInputType
    _min?: UserProfileMinAggregateInputType
    _max?: UserProfileMaxAggregateInputType
  }

  export type UserProfileGroupByOutputType = {
    id: string
    userId: string
    displayName: string
    bio: string | null
    profileImageUrl: string | null
    headerImageUrl: string | null
    location: string | null
    website: string | null
    personaType: $Enums.PersonaType
    specialtyAreas: string[]
    verificationBadge: boolean
    followerCount: number
    followingCount: number
    postCount: number
    createdAt: Date
    updatedAt: Date
    _count: UserProfileCountAggregateOutputType | null
    _avg: UserProfileAvgAggregateOutputType | null
    _sum: UserProfileSumAggregateOutputType | null
    _min: UserProfileMinAggregateOutputType | null
    _max: UserProfileMaxAggregateOutputType | null
  }

  type GetUserProfileGroupByPayload<T extends UserProfileGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserProfileGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserProfileGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserProfileGroupByOutputType[P]>
            : GetScalarType<T[P], UserProfileGroupByOutputType[P]>
        }
      >
    >


  export type UserProfileSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    displayName?: boolean
    bio?: boolean
    profileImageUrl?: boolean
    headerImageUrl?: boolean
    location?: boolean
    website?: boolean
    personaType?: boolean
    specialtyAreas?: boolean
    verificationBadge?: boolean
    followerCount?: boolean
    followingCount?: boolean
    postCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserAccountDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userProfile"]>

  export type UserProfileSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    displayName?: boolean
    bio?: boolean
    profileImageUrl?: boolean
    headerImageUrl?: boolean
    location?: boolean
    website?: boolean
    personaType?: boolean
    specialtyAreas?: boolean
    verificationBadge?: boolean
    followerCount?: boolean
    followingCount?: boolean
    postCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserAccountDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userProfile"]>

  export type UserProfileSelectScalar = {
    id?: boolean
    userId?: boolean
    displayName?: boolean
    bio?: boolean
    profileImageUrl?: boolean
    headerImageUrl?: boolean
    location?: boolean
    website?: boolean
    personaType?: boolean
    specialtyAreas?: boolean
    verificationBadge?: boolean
    followerCount?: boolean
    followingCount?: boolean
    postCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserProfileInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserAccountDefaultArgs<ExtArgs>
  }
  export type UserProfileIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserAccountDefaultArgs<ExtArgs>
  }

  export type $UserProfilePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserProfile"
    objects: {
      user: Prisma.$UserAccountPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      displayName: string
      bio: string | null
      profileImageUrl: string | null
      headerImageUrl: string | null
      location: string | null
      website: string | null
      personaType: $Enums.PersonaType
      specialtyAreas: string[]
      verificationBadge: boolean
      followerCount: number
      followingCount: number
      postCount: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["userProfile"]>
    composites: {}
  }

  type UserProfileGetPayload<S extends boolean | null | undefined | UserProfileDefaultArgs> = $Result.GetResult<Prisma.$UserProfilePayload, S>

  type UserProfileCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserProfileFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserProfileCountAggregateInputType | true
    }

  export interface UserProfileDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserProfile'], meta: { name: 'UserProfile' } }
    /**
     * Find zero or one UserProfile that matches the filter.
     * @param {UserProfileFindUniqueArgs} args - Arguments to find a UserProfile
     * @example
     * // Get one UserProfile
     * const userProfile = await prisma.userProfile.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserProfileFindUniqueArgs>(args: SelectSubset<T, UserProfileFindUniqueArgs<ExtArgs>>): Prisma__UserProfileClient<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one UserProfile that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UserProfileFindUniqueOrThrowArgs} args - Arguments to find a UserProfile
     * @example
     * // Get one UserProfile
     * const userProfile = await prisma.userProfile.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserProfileFindUniqueOrThrowArgs>(args: SelectSubset<T, UserProfileFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserProfileClient<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first UserProfile that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProfileFindFirstArgs} args - Arguments to find a UserProfile
     * @example
     * // Get one UserProfile
     * const userProfile = await prisma.userProfile.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserProfileFindFirstArgs>(args?: SelectSubset<T, UserProfileFindFirstArgs<ExtArgs>>): Prisma__UserProfileClient<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first UserProfile that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProfileFindFirstOrThrowArgs} args - Arguments to find a UserProfile
     * @example
     * // Get one UserProfile
     * const userProfile = await prisma.userProfile.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserProfileFindFirstOrThrowArgs>(args?: SelectSubset<T, UserProfileFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserProfileClient<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more UserProfiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProfileFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserProfiles
     * const userProfiles = await prisma.userProfile.findMany()
     * 
     * // Get first 10 UserProfiles
     * const userProfiles = await prisma.userProfile.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userProfileWithIdOnly = await prisma.userProfile.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserProfileFindManyArgs>(args?: SelectSubset<T, UserProfileFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a UserProfile.
     * @param {UserProfileCreateArgs} args - Arguments to create a UserProfile.
     * @example
     * // Create one UserProfile
     * const UserProfile = await prisma.userProfile.create({
     *   data: {
     *     // ... data to create a UserProfile
     *   }
     * })
     * 
     */
    create<T extends UserProfileCreateArgs>(args: SelectSubset<T, UserProfileCreateArgs<ExtArgs>>): Prisma__UserProfileClient<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many UserProfiles.
     * @param {UserProfileCreateManyArgs} args - Arguments to create many UserProfiles.
     * @example
     * // Create many UserProfiles
     * const userProfile = await prisma.userProfile.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserProfileCreateManyArgs>(args?: SelectSubset<T, UserProfileCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserProfiles and returns the data saved in the database.
     * @param {UserProfileCreateManyAndReturnArgs} args - Arguments to create many UserProfiles.
     * @example
     * // Create many UserProfiles
     * const userProfile = await prisma.userProfile.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserProfiles and only return the `id`
     * const userProfileWithIdOnly = await prisma.userProfile.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserProfileCreateManyAndReturnArgs>(args?: SelectSubset<T, UserProfileCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a UserProfile.
     * @param {UserProfileDeleteArgs} args - Arguments to delete one UserProfile.
     * @example
     * // Delete one UserProfile
     * const UserProfile = await prisma.userProfile.delete({
     *   where: {
     *     // ... filter to delete one UserProfile
     *   }
     * })
     * 
     */
    delete<T extends UserProfileDeleteArgs>(args: SelectSubset<T, UserProfileDeleteArgs<ExtArgs>>): Prisma__UserProfileClient<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one UserProfile.
     * @param {UserProfileUpdateArgs} args - Arguments to update one UserProfile.
     * @example
     * // Update one UserProfile
     * const userProfile = await prisma.userProfile.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserProfileUpdateArgs>(args: SelectSubset<T, UserProfileUpdateArgs<ExtArgs>>): Prisma__UserProfileClient<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more UserProfiles.
     * @param {UserProfileDeleteManyArgs} args - Arguments to filter UserProfiles to delete.
     * @example
     * // Delete a few UserProfiles
     * const { count } = await prisma.userProfile.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserProfileDeleteManyArgs>(args?: SelectSubset<T, UserProfileDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserProfiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProfileUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserProfiles
     * const userProfile = await prisma.userProfile.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserProfileUpdateManyArgs>(args: SelectSubset<T, UserProfileUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one UserProfile.
     * @param {UserProfileUpsertArgs} args - Arguments to update or create a UserProfile.
     * @example
     * // Update or create a UserProfile
     * const userProfile = await prisma.userProfile.upsert({
     *   create: {
     *     // ... data to create a UserProfile
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserProfile we want to update
     *   }
     * })
     */
    upsert<T extends UserProfileUpsertArgs>(args: SelectSubset<T, UserProfileUpsertArgs<ExtArgs>>): Prisma__UserProfileClient<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of UserProfiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProfileCountArgs} args - Arguments to filter UserProfiles to count.
     * @example
     * // Count the number of UserProfiles
     * const count = await prisma.userProfile.count({
     *   where: {
     *     // ... the filter for the UserProfiles we want to count
     *   }
     * })
    **/
    count<T extends UserProfileCountArgs>(
      args?: Subset<T, UserProfileCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserProfileCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserProfile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProfileAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserProfileAggregateArgs>(args: Subset<T, UserProfileAggregateArgs>): Prisma.PrismaPromise<GetUserProfileAggregateType<T>>

    /**
     * Group by UserProfile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProfileGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserProfileGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserProfileGroupByArgs['orderBy'] }
        : { orderBy?: UserProfileGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserProfileGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserProfileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserProfile model
   */
  readonly fields: UserProfileFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserProfile.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserProfileClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserAccountDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserAccountDefaultArgs<ExtArgs>>): Prisma__UserAccountClient<$Result.GetResult<Prisma.$UserAccountPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UserProfile model
   */ 
  interface UserProfileFieldRefs {
    readonly id: FieldRef<"UserProfile", 'String'>
    readonly userId: FieldRef<"UserProfile", 'String'>
    readonly displayName: FieldRef<"UserProfile", 'String'>
    readonly bio: FieldRef<"UserProfile", 'String'>
    readonly profileImageUrl: FieldRef<"UserProfile", 'String'>
    readonly headerImageUrl: FieldRef<"UserProfile", 'String'>
    readonly location: FieldRef<"UserProfile", 'String'>
    readonly website: FieldRef<"UserProfile", 'String'>
    readonly personaType: FieldRef<"UserProfile", 'PersonaType'>
    readonly specialtyAreas: FieldRef<"UserProfile", 'String[]'>
    readonly verificationBadge: FieldRef<"UserProfile", 'Boolean'>
    readonly followerCount: FieldRef<"UserProfile", 'Int'>
    readonly followingCount: FieldRef<"UserProfile", 'Int'>
    readonly postCount: FieldRef<"UserProfile", 'Int'>
    readonly createdAt: FieldRef<"UserProfile", 'DateTime'>
    readonly updatedAt: FieldRef<"UserProfile", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UserProfile findUnique
   */
  export type UserProfileFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileInclude<ExtArgs> | null
    /**
     * Filter, which UserProfile to fetch.
     */
    where: UserProfileWhereUniqueInput
  }

  /**
   * UserProfile findUniqueOrThrow
   */
  export type UserProfileFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileInclude<ExtArgs> | null
    /**
     * Filter, which UserProfile to fetch.
     */
    where: UserProfileWhereUniqueInput
  }

  /**
   * UserProfile findFirst
   */
  export type UserProfileFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileInclude<ExtArgs> | null
    /**
     * Filter, which UserProfile to fetch.
     */
    where?: UserProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserProfiles to fetch.
     */
    orderBy?: UserProfileOrderByWithRelationInput | UserProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserProfiles.
     */
    cursor?: UserProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserProfiles.
     */
    distinct?: UserProfileScalarFieldEnum | UserProfileScalarFieldEnum[]
  }

  /**
   * UserProfile findFirstOrThrow
   */
  export type UserProfileFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileInclude<ExtArgs> | null
    /**
     * Filter, which UserProfile to fetch.
     */
    where?: UserProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserProfiles to fetch.
     */
    orderBy?: UserProfileOrderByWithRelationInput | UserProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserProfiles.
     */
    cursor?: UserProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserProfiles.
     */
    distinct?: UserProfileScalarFieldEnum | UserProfileScalarFieldEnum[]
  }

  /**
   * UserProfile findMany
   */
  export type UserProfileFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileInclude<ExtArgs> | null
    /**
     * Filter, which UserProfiles to fetch.
     */
    where?: UserProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserProfiles to fetch.
     */
    orderBy?: UserProfileOrderByWithRelationInput | UserProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserProfiles.
     */
    cursor?: UserProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserProfiles.
     */
    skip?: number
    distinct?: UserProfileScalarFieldEnum | UserProfileScalarFieldEnum[]
  }

  /**
   * UserProfile create
   */
  export type UserProfileCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileInclude<ExtArgs> | null
    /**
     * The data needed to create a UserProfile.
     */
    data: XOR<UserProfileCreateInput, UserProfileUncheckedCreateInput>
  }

  /**
   * UserProfile createMany
   */
  export type UserProfileCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserProfiles.
     */
    data: UserProfileCreateManyInput | UserProfileCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserProfile createManyAndReturn
   */
  export type UserProfileCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many UserProfiles.
     */
    data: UserProfileCreateManyInput | UserProfileCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserProfile update
   */
  export type UserProfileUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileInclude<ExtArgs> | null
    /**
     * The data needed to update a UserProfile.
     */
    data: XOR<UserProfileUpdateInput, UserProfileUncheckedUpdateInput>
    /**
     * Choose, which UserProfile to update.
     */
    where: UserProfileWhereUniqueInput
  }

  /**
   * UserProfile updateMany
   */
  export type UserProfileUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserProfiles.
     */
    data: XOR<UserProfileUpdateManyMutationInput, UserProfileUncheckedUpdateManyInput>
    /**
     * Filter which UserProfiles to update
     */
    where?: UserProfileWhereInput
  }

  /**
   * UserProfile upsert
   */
  export type UserProfileUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileInclude<ExtArgs> | null
    /**
     * The filter to search for the UserProfile to update in case it exists.
     */
    where: UserProfileWhereUniqueInput
    /**
     * In case the UserProfile found by the `where` argument doesn't exist, create a new UserProfile with this data.
     */
    create: XOR<UserProfileCreateInput, UserProfileUncheckedCreateInput>
    /**
     * In case the UserProfile was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserProfileUpdateInput, UserProfileUncheckedUpdateInput>
  }

  /**
   * UserProfile delete
   */
  export type UserProfileDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileInclude<ExtArgs> | null
    /**
     * Filter which UserProfile to delete.
     */
    where: UserProfileWhereUniqueInput
  }

  /**
   * UserProfile deleteMany
   */
  export type UserProfileDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserProfiles to delete
     */
    where?: UserProfileWhereInput
  }

  /**
   * UserProfile without action
   */
  export type UserProfileDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileInclude<ExtArgs> | null
  }


  /**
   * Model PoliticalAlignment
   */

  export type AggregatePoliticalAlignment = {
    _count: PoliticalAlignmentCountAggregateOutputType | null
    _avg: PoliticalAlignmentAvgAggregateOutputType | null
    _sum: PoliticalAlignmentSumAggregateOutputType | null
    _min: PoliticalAlignmentMinAggregateOutputType | null
    _max: PoliticalAlignmentMaxAggregateOutputType | null
  }

  export type PoliticalAlignmentAvgAggregateOutputType = {
    economicPosition: number | null
    socialPosition: number | null
    debateWillingness: number | null
    controversyTolerance: number | null
  }

  export type PoliticalAlignmentSumAggregateOutputType = {
    economicPosition: number | null
    socialPosition: number | null
    debateWillingness: number | null
    controversyTolerance: number | null
  }

  export type PoliticalAlignmentMinAggregateOutputType = {
    id: string | null
    userId: string | null
    economicPosition: number | null
    socialPosition: number | null
    partyAffiliation: string | null
    debateWillingness: number | null
    controversyTolerance: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PoliticalAlignmentMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    economicPosition: number | null
    socialPosition: number | null
    partyAffiliation: string | null
    debateWillingness: number | null
    controversyTolerance: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PoliticalAlignmentCountAggregateOutputType = {
    id: number
    userId: number
    economicPosition: number
    socialPosition: number
    primaryIssues: number
    partyAffiliation: number
    ideologyTags: number
    debateWillingness: number
    controversyTolerance: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PoliticalAlignmentAvgAggregateInputType = {
    economicPosition?: true
    socialPosition?: true
    debateWillingness?: true
    controversyTolerance?: true
  }

  export type PoliticalAlignmentSumAggregateInputType = {
    economicPosition?: true
    socialPosition?: true
    debateWillingness?: true
    controversyTolerance?: true
  }

  export type PoliticalAlignmentMinAggregateInputType = {
    id?: true
    userId?: true
    economicPosition?: true
    socialPosition?: true
    partyAffiliation?: true
    debateWillingness?: true
    controversyTolerance?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PoliticalAlignmentMaxAggregateInputType = {
    id?: true
    userId?: true
    economicPosition?: true
    socialPosition?: true
    partyAffiliation?: true
    debateWillingness?: true
    controversyTolerance?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PoliticalAlignmentCountAggregateInputType = {
    id?: true
    userId?: true
    economicPosition?: true
    socialPosition?: true
    primaryIssues?: true
    partyAffiliation?: true
    ideologyTags?: true
    debateWillingness?: true
    controversyTolerance?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PoliticalAlignmentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PoliticalAlignment to aggregate.
     */
    where?: PoliticalAlignmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PoliticalAlignments to fetch.
     */
    orderBy?: PoliticalAlignmentOrderByWithRelationInput | PoliticalAlignmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PoliticalAlignmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PoliticalAlignments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PoliticalAlignments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PoliticalAlignments
    **/
    _count?: true | PoliticalAlignmentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PoliticalAlignmentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PoliticalAlignmentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PoliticalAlignmentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PoliticalAlignmentMaxAggregateInputType
  }

  export type GetPoliticalAlignmentAggregateType<T extends PoliticalAlignmentAggregateArgs> = {
        [P in keyof T & keyof AggregatePoliticalAlignment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePoliticalAlignment[P]>
      : GetScalarType<T[P], AggregatePoliticalAlignment[P]>
  }




  export type PoliticalAlignmentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PoliticalAlignmentWhereInput
    orderBy?: PoliticalAlignmentOrderByWithAggregationInput | PoliticalAlignmentOrderByWithAggregationInput[]
    by: PoliticalAlignmentScalarFieldEnum[] | PoliticalAlignmentScalarFieldEnum
    having?: PoliticalAlignmentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PoliticalAlignmentCountAggregateInputType | true
    _avg?: PoliticalAlignmentAvgAggregateInputType
    _sum?: PoliticalAlignmentSumAggregateInputType
    _min?: PoliticalAlignmentMinAggregateInputType
    _max?: PoliticalAlignmentMaxAggregateInputType
  }

  export type PoliticalAlignmentGroupByOutputType = {
    id: string
    userId: string
    economicPosition: number
    socialPosition: number
    primaryIssues: string[]
    partyAffiliation: string | null
    ideologyTags: string[]
    debateWillingness: number
    controversyTolerance: number
    createdAt: Date
    updatedAt: Date
    _count: PoliticalAlignmentCountAggregateOutputType | null
    _avg: PoliticalAlignmentAvgAggregateOutputType | null
    _sum: PoliticalAlignmentSumAggregateOutputType | null
    _min: PoliticalAlignmentMinAggregateOutputType | null
    _max: PoliticalAlignmentMaxAggregateOutputType | null
  }

  type GetPoliticalAlignmentGroupByPayload<T extends PoliticalAlignmentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PoliticalAlignmentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PoliticalAlignmentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PoliticalAlignmentGroupByOutputType[P]>
            : GetScalarType<T[P], PoliticalAlignmentGroupByOutputType[P]>
        }
      >
    >


  export type PoliticalAlignmentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    economicPosition?: boolean
    socialPosition?: boolean
    primaryIssues?: boolean
    partyAffiliation?: boolean
    ideologyTags?: boolean
    debateWillingness?: boolean
    controversyTolerance?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserAccountDefaultArgs<ExtArgs>
    personas?: boolean | PoliticalAlignment$personasArgs<ExtArgs>
    _count?: boolean | PoliticalAlignmentCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["politicalAlignment"]>

  export type PoliticalAlignmentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    economicPosition?: boolean
    socialPosition?: boolean
    primaryIssues?: boolean
    partyAffiliation?: boolean
    ideologyTags?: boolean
    debateWillingness?: boolean
    controversyTolerance?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserAccountDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["politicalAlignment"]>

  export type PoliticalAlignmentSelectScalar = {
    id?: boolean
    userId?: boolean
    economicPosition?: boolean
    socialPosition?: boolean
    primaryIssues?: boolean
    partyAffiliation?: boolean
    ideologyTags?: boolean
    debateWillingness?: boolean
    controversyTolerance?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PoliticalAlignmentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserAccountDefaultArgs<ExtArgs>
    personas?: boolean | PoliticalAlignment$personasArgs<ExtArgs>
    _count?: boolean | PoliticalAlignmentCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PoliticalAlignmentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserAccountDefaultArgs<ExtArgs>
  }

  export type $PoliticalAlignmentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PoliticalAlignment"
    objects: {
      user: Prisma.$UserAccountPayload<ExtArgs>
      personas: Prisma.$PersonaPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      economicPosition: number
      socialPosition: number
      primaryIssues: string[]
      partyAffiliation: string | null
      ideologyTags: string[]
      debateWillingness: number
      controversyTolerance: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["politicalAlignment"]>
    composites: {}
  }

  type PoliticalAlignmentGetPayload<S extends boolean | null | undefined | PoliticalAlignmentDefaultArgs> = $Result.GetResult<Prisma.$PoliticalAlignmentPayload, S>

  type PoliticalAlignmentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PoliticalAlignmentFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PoliticalAlignmentCountAggregateInputType | true
    }

  export interface PoliticalAlignmentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PoliticalAlignment'], meta: { name: 'PoliticalAlignment' } }
    /**
     * Find zero or one PoliticalAlignment that matches the filter.
     * @param {PoliticalAlignmentFindUniqueArgs} args - Arguments to find a PoliticalAlignment
     * @example
     * // Get one PoliticalAlignment
     * const politicalAlignment = await prisma.politicalAlignment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PoliticalAlignmentFindUniqueArgs>(args: SelectSubset<T, PoliticalAlignmentFindUniqueArgs<ExtArgs>>): Prisma__PoliticalAlignmentClient<$Result.GetResult<Prisma.$PoliticalAlignmentPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one PoliticalAlignment that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PoliticalAlignmentFindUniqueOrThrowArgs} args - Arguments to find a PoliticalAlignment
     * @example
     * // Get one PoliticalAlignment
     * const politicalAlignment = await prisma.politicalAlignment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PoliticalAlignmentFindUniqueOrThrowArgs>(args: SelectSubset<T, PoliticalAlignmentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PoliticalAlignmentClient<$Result.GetResult<Prisma.$PoliticalAlignmentPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first PoliticalAlignment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PoliticalAlignmentFindFirstArgs} args - Arguments to find a PoliticalAlignment
     * @example
     * // Get one PoliticalAlignment
     * const politicalAlignment = await prisma.politicalAlignment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PoliticalAlignmentFindFirstArgs>(args?: SelectSubset<T, PoliticalAlignmentFindFirstArgs<ExtArgs>>): Prisma__PoliticalAlignmentClient<$Result.GetResult<Prisma.$PoliticalAlignmentPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first PoliticalAlignment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PoliticalAlignmentFindFirstOrThrowArgs} args - Arguments to find a PoliticalAlignment
     * @example
     * // Get one PoliticalAlignment
     * const politicalAlignment = await prisma.politicalAlignment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PoliticalAlignmentFindFirstOrThrowArgs>(args?: SelectSubset<T, PoliticalAlignmentFindFirstOrThrowArgs<ExtArgs>>): Prisma__PoliticalAlignmentClient<$Result.GetResult<Prisma.$PoliticalAlignmentPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more PoliticalAlignments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PoliticalAlignmentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PoliticalAlignments
     * const politicalAlignments = await prisma.politicalAlignment.findMany()
     * 
     * // Get first 10 PoliticalAlignments
     * const politicalAlignments = await prisma.politicalAlignment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const politicalAlignmentWithIdOnly = await prisma.politicalAlignment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PoliticalAlignmentFindManyArgs>(args?: SelectSubset<T, PoliticalAlignmentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PoliticalAlignmentPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a PoliticalAlignment.
     * @param {PoliticalAlignmentCreateArgs} args - Arguments to create a PoliticalAlignment.
     * @example
     * // Create one PoliticalAlignment
     * const PoliticalAlignment = await prisma.politicalAlignment.create({
     *   data: {
     *     // ... data to create a PoliticalAlignment
     *   }
     * })
     * 
     */
    create<T extends PoliticalAlignmentCreateArgs>(args: SelectSubset<T, PoliticalAlignmentCreateArgs<ExtArgs>>): Prisma__PoliticalAlignmentClient<$Result.GetResult<Prisma.$PoliticalAlignmentPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many PoliticalAlignments.
     * @param {PoliticalAlignmentCreateManyArgs} args - Arguments to create many PoliticalAlignments.
     * @example
     * // Create many PoliticalAlignments
     * const politicalAlignment = await prisma.politicalAlignment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PoliticalAlignmentCreateManyArgs>(args?: SelectSubset<T, PoliticalAlignmentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PoliticalAlignments and returns the data saved in the database.
     * @param {PoliticalAlignmentCreateManyAndReturnArgs} args - Arguments to create many PoliticalAlignments.
     * @example
     * // Create many PoliticalAlignments
     * const politicalAlignment = await prisma.politicalAlignment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PoliticalAlignments and only return the `id`
     * const politicalAlignmentWithIdOnly = await prisma.politicalAlignment.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PoliticalAlignmentCreateManyAndReturnArgs>(args?: SelectSubset<T, PoliticalAlignmentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PoliticalAlignmentPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a PoliticalAlignment.
     * @param {PoliticalAlignmentDeleteArgs} args - Arguments to delete one PoliticalAlignment.
     * @example
     * // Delete one PoliticalAlignment
     * const PoliticalAlignment = await prisma.politicalAlignment.delete({
     *   where: {
     *     // ... filter to delete one PoliticalAlignment
     *   }
     * })
     * 
     */
    delete<T extends PoliticalAlignmentDeleteArgs>(args: SelectSubset<T, PoliticalAlignmentDeleteArgs<ExtArgs>>): Prisma__PoliticalAlignmentClient<$Result.GetResult<Prisma.$PoliticalAlignmentPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one PoliticalAlignment.
     * @param {PoliticalAlignmentUpdateArgs} args - Arguments to update one PoliticalAlignment.
     * @example
     * // Update one PoliticalAlignment
     * const politicalAlignment = await prisma.politicalAlignment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PoliticalAlignmentUpdateArgs>(args: SelectSubset<T, PoliticalAlignmentUpdateArgs<ExtArgs>>): Prisma__PoliticalAlignmentClient<$Result.GetResult<Prisma.$PoliticalAlignmentPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more PoliticalAlignments.
     * @param {PoliticalAlignmentDeleteManyArgs} args - Arguments to filter PoliticalAlignments to delete.
     * @example
     * // Delete a few PoliticalAlignments
     * const { count } = await prisma.politicalAlignment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PoliticalAlignmentDeleteManyArgs>(args?: SelectSubset<T, PoliticalAlignmentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PoliticalAlignments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PoliticalAlignmentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PoliticalAlignments
     * const politicalAlignment = await prisma.politicalAlignment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PoliticalAlignmentUpdateManyArgs>(args: SelectSubset<T, PoliticalAlignmentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PoliticalAlignment.
     * @param {PoliticalAlignmentUpsertArgs} args - Arguments to update or create a PoliticalAlignment.
     * @example
     * // Update or create a PoliticalAlignment
     * const politicalAlignment = await prisma.politicalAlignment.upsert({
     *   create: {
     *     // ... data to create a PoliticalAlignment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PoliticalAlignment we want to update
     *   }
     * })
     */
    upsert<T extends PoliticalAlignmentUpsertArgs>(args: SelectSubset<T, PoliticalAlignmentUpsertArgs<ExtArgs>>): Prisma__PoliticalAlignmentClient<$Result.GetResult<Prisma.$PoliticalAlignmentPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of PoliticalAlignments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PoliticalAlignmentCountArgs} args - Arguments to filter PoliticalAlignments to count.
     * @example
     * // Count the number of PoliticalAlignments
     * const count = await prisma.politicalAlignment.count({
     *   where: {
     *     // ... the filter for the PoliticalAlignments we want to count
     *   }
     * })
    **/
    count<T extends PoliticalAlignmentCountArgs>(
      args?: Subset<T, PoliticalAlignmentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PoliticalAlignmentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PoliticalAlignment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PoliticalAlignmentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PoliticalAlignmentAggregateArgs>(args: Subset<T, PoliticalAlignmentAggregateArgs>): Prisma.PrismaPromise<GetPoliticalAlignmentAggregateType<T>>

    /**
     * Group by PoliticalAlignment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PoliticalAlignmentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PoliticalAlignmentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PoliticalAlignmentGroupByArgs['orderBy'] }
        : { orderBy?: PoliticalAlignmentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PoliticalAlignmentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPoliticalAlignmentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PoliticalAlignment model
   */
  readonly fields: PoliticalAlignmentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PoliticalAlignment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PoliticalAlignmentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserAccountDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserAccountDefaultArgs<ExtArgs>>): Prisma__UserAccountClient<$Result.GetResult<Prisma.$UserAccountPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    personas<T extends PoliticalAlignment$personasArgs<ExtArgs> = {}>(args?: Subset<T, PoliticalAlignment$personasArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PersonaPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PoliticalAlignment model
   */ 
  interface PoliticalAlignmentFieldRefs {
    readonly id: FieldRef<"PoliticalAlignment", 'String'>
    readonly userId: FieldRef<"PoliticalAlignment", 'String'>
    readonly economicPosition: FieldRef<"PoliticalAlignment", 'Int'>
    readonly socialPosition: FieldRef<"PoliticalAlignment", 'Int'>
    readonly primaryIssues: FieldRef<"PoliticalAlignment", 'String[]'>
    readonly partyAffiliation: FieldRef<"PoliticalAlignment", 'String'>
    readonly ideologyTags: FieldRef<"PoliticalAlignment", 'String[]'>
    readonly debateWillingness: FieldRef<"PoliticalAlignment", 'Int'>
    readonly controversyTolerance: FieldRef<"PoliticalAlignment", 'Int'>
    readonly createdAt: FieldRef<"PoliticalAlignment", 'DateTime'>
    readonly updatedAt: FieldRef<"PoliticalAlignment", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PoliticalAlignment findUnique
   */
  export type PoliticalAlignmentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PoliticalAlignment
     */
    select?: PoliticalAlignmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PoliticalAlignmentInclude<ExtArgs> | null
    /**
     * Filter, which PoliticalAlignment to fetch.
     */
    where: PoliticalAlignmentWhereUniqueInput
  }

  /**
   * PoliticalAlignment findUniqueOrThrow
   */
  export type PoliticalAlignmentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PoliticalAlignment
     */
    select?: PoliticalAlignmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PoliticalAlignmentInclude<ExtArgs> | null
    /**
     * Filter, which PoliticalAlignment to fetch.
     */
    where: PoliticalAlignmentWhereUniqueInput
  }

  /**
   * PoliticalAlignment findFirst
   */
  export type PoliticalAlignmentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PoliticalAlignment
     */
    select?: PoliticalAlignmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PoliticalAlignmentInclude<ExtArgs> | null
    /**
     * Filter, which PoliticalAlignment to fetch.
     */
    where?: PoliticalAlignmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PoliticalAlignments to fetch.
     */
    orderBy?: PoliticalAlignmentOrderByWithRelationInput | PoliticalAlignmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PoliticalAlignments.
     */
    cursor?: PoliticalAlignmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PoliticalAlignments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PoliticalAlignments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PoliticalAlignments.
     */
    distinct?: PoliticalAlignmentScalarFieldEnum | PoliticalAlignmentScalarFieldEnum[]
  }

  /**
   * PoliticalAlignment findFirstOrThrow
   */
  export type PoliticalAlignmentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PoliticalAlignment
     */
    select?: PoliticalAlignmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PoliticalAlignmentInclude<ExtArgs> | null
    /**
     * Filter, which PoliticalAlignment to fetch.
     */
    where?: PoliticalAlignmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PoliticalAlignments to fetch.
     */
    orderBy?: PoliticalAlignmentOrderByWithRelationInput | PoliticalAlignmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PoliticalAlignments.
     */
    cursor?: PoliticalAlignmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PoliticalAlignments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PoliticalAlignments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PoliticalAlignments.
     */
    distinct?: PoliticalAlignmentScalarFieldEnum | PoliticalAlignmentScalarFieldEnum[]
  }

  /**
   * PoliticalAlignment findMany
   */
  export type PoliticalAlignmentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PoliticalAlignment
     */
    select?: PoliticalAlignmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PoliticalAlignmentInclude<ExtArgs> | null
    /**
     * Filter, which PoliticalAlignments to fetch.
     */
    where?: PoliticalAlignmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PoliticalAlignments to fetch.
     */
    orderBy?: PoliticalAlignmentOrderByWithRelationInput | PoliticalAlignmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PoliticalAlignments.
     */
    cursor?: PoliticalAlignmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PoliticalAlignments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PoliticalAlignments.
     */
    skip?: number
    distinct?: PoliticalAlignmentScalarFieldEnum | PoliticalAlignmentScalarFieldEnum[]
  }

  /**
   * PoliticalAlignment create
   */
  export type PoliticalAlignmentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PoliticalAlignment
     */
    select?: PoliticalAlignmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PoliticalAlignmentInclude<ExtArgs> | null
    /**
     * The data needed to create a PoliticalAlignment.
     */
    data: XOR<PoliticalAlignmentCreateInput, PoliticalAlignmentUncheckedCreateInput>
  }

  /**
   * PoliticalAlignment createMany
   */
  export type PoliticalAlignmentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PoliticalAlignments.
     */
    data: PoliticalAlignmentCreateManyInput | PoliticalAlignmentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PoliticalAlignment createManyAndReturn
   */
  export type PoliticalAlignmentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PoliticalAlignment
     */
    select?: PoliticalAlignmentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many PoliticalAlignments.
     */
    data: PoliticalAlignmentCreateManyInput | PoliticalAlignmentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PoliticalAlignmentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PoliticalAlignment update
   */
  export type PoliticalAlignmentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PoliticalAlignment
     */
    select?: PoliticalAlignmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PoliticalAlignmentInclude<ExtArgs> | null
    /**
     * The data needed to update a PoliticalAlignment.
     */
    data: XOR<PoliticalAlignmentUpdateInput, PoliticalAlignmentUncheckedUpdateInput>
    /**
     * Choose, which PoliticalAlignment to update.
     */
    where: PoliticalAlignmentWhereUniqueInput
  }

  /**
   * PoliticalAlignment updateMany
   */
  export type PoliticalAlignmentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PoliticalAlignments.
     */
    data: XOR<PoliticalAlignmentUpdateManyMutationInput, PoliticalAlignmentUncheckedUpdateManyInput>
    /**
     * Filter which PoliticalAlignments to update
     */
    where?: PoliticalAlignmentWhereInput
  }

  /**
   * PoliticalAlignment upsert
   */
  export type PoliticalAlignmentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PoliticalAlignment
     */
    select?: PoliticalAlignmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PoliticalAlignmentInclude<ExtArgs> | null
    /**
     * The filter to search for the PoliticalAlignment to update in case it exists.
     */
    where: PoliticalAlignmentWhereUniqueInput
    /**
     * In case the PoliticalAlignment found by the `where` argument doesn't exist, create a new PoliticalAlignment with this data.
     */
    create: XOR<PoliticalAlignmentCreateInput, PoliticalAlignmentUncheckedCreateInput>
    /**
     * In case the PoliticalAlignment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PoliticalAlignmentUpdateInput, PoliticalAlignmentUncheckedUpdateInput>
  }

  /**
   * PoliticalAlignment delete
   */
  export type PoliticalAlignmentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PoliticalAlignment
     */
    select?: PoliticalAlignmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PoliticalAlignmentInclude<ExtArgs> | null
    /**
     * Filter which PoliticalAlignment to delete.
     */
    where: PoliticalAlignmentWhereUniqueInput
  }

  /**
   * PoliticalAlignment deleteMany
   */
  export type PoliticalAlignmentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PoliticalAlignments to delete
     */
    where?: PoliticalAlignmentWhereInput
  }

  /**
   * PoliticalAlignment.personas
   */
  export type PoliticalAlignment$personasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Persona
     */
    select?: PersonaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersonaInclude<ExtArgs> | null
    where?: PersonaWhereInput
    orderBy?: PersonaOrderByWithRelationInput | PersonaOrderByWithRelationInput[]
    cursor?: PersonaWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PersonaScalarFieldEnum | PersonaScalarFieldEnum[]
  }

  /**
   * PoliticalAlignment without action
   */
  export type PoliticalAlignmentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PoliticalAlignment
     */
    select?: PoliticalAlignmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PoliticalAlignmentInclude<ExtArgs> | null
  }


  /**
   * Model InfluenceMetrics
   */

  export type AggregateInfluenceMetrics = {
    _count: InfluenceMetricsCountAggregateOutputType | null
    _avg: InfluenceMetricsAvgAggregateOutputType | null
    _sum: InfluenceMetricsSumAggregateOutputType | null
    _min: InfluenceMetricsMinAggregateOutputType | null
    _max: InfluenceMetricsMaxAggregateOutputType | null
  }

  export type InfluenceMetricsAvgAggregateOutputType = {
    followerCount: number | null
    followingCount: number | null
    engagementRate: number | null
    reachScore: number | null
    approvalRating: number | null
    controversyLevel: number | null
    trendingScore: number | null
    followerGrowthDaily: number | null
    followerGrowthWeekly: number | null
    followerGrowthMonthly: number | null
    totalLikes: number | null
    totalReshares: number | null
    totalComments: number | null
    influenceRank: number | null
    categoryRank: number | null
  }

  export type InfluenceMetricsSumAggregateOutputType = {
    followerCount: number | null
    followingCount: number | null
    engagementRate: number | null
    reachScore: number | null
    approvalRating: number | null
    controversyLevel: number | null
    trendingScore: number | null
    followerGrowthDaily: number | null
    followerGrowthWeekly: number | null
    followerGrowthMonthly: number | null
    totalLikes: number | null
    totalReshares: number | null
    totalComments: number | null
    influenceRank: number | null
    categoryRank: number | null
  }

  export type InfluenceMetricsMinAggregateOutputType = {
    id: string | null
    userId: string | null
    followerCount: number | null
    followingCount: number | null
    engagementRate: number | null
    reachScore: number | null
    approvalRating: number | null
    controversyLevel: number | null
    trendingScore: number | null
    followerGrowthDaily: number | null
    followerGrowthWeekly: number | null
    followerGrowthMonthly: number | null
    totalLikes: number | null
    totalReshares: number | null
    totalComments: number | null
    influenceRank: number | null
    categoryRank: number | null
    lastUpdated: Date | null
    createdAt: Date | null
  }

  export type InfluenceMetricsMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    followerCount: number | null
    followingCount: number | null
    engagementRate: number | null
    reachScore: number | null
    approvalRating: number | null
    controversyLevel: number | null
    trendingScore: number | null
    followerGrowthDaily: number | null
    followerGrowthWeekly: number | null
    followerGrowthMonthly: number | null
    totalLikes: number | null
    totalReshares: number | null
    totalComments: number | null
    influenceRank: number | null
    categoryRank: number | null
    lastUpdated: Date | null
    createdAt: Date | null
  }

  export type InfluenceMetricsCountAggregateOutputType = {
    id: number
    userId: number
    followerCount: number
    followingCount: number
    engagementRate: number
    reachScore: number
    approvalRating: number
    controversyLevel: number
    trendingScore: number
    followerGrowthDaily: number
    followerGrowthWeekly: number
    followerGrowthMonthly: number
    totalLikes: number
    totalReshares: number
    totalComments: number
    influenceRank: number
    categoryRank: number
    lastUpdated: number
    createdAt: number
    _all: number
  }


  export type InfluenceMetricsAvgAggregateInputType = {
    followerCount?: true
    followingCount?: true
    engagementRate?: true
    reachScore?: true
    approvalRating?: true
    controversyLevel?: true
    trendingScore?: true
    followerGrowthDaily?: true
    followerGrowthWeekly?: true
    followerGrowthMonthly?: true
    totalLikes?: true
    totalReshares?: true
    totalComments?: true
    influenceRank?: true
    categoryRank?: true
  }

  export type InfluenceMetricsSumAggregateInputType = {
    followerCount?: true
    followingCount?: true
    engagementRate?: true
    reachScore?: true
    approvalRating?: true
    controversyLevel?: true
    trendingScore?: true
    followerGrowthDaily?: true
    followerGrowthWeekly?: true
    followerGrowthMonthly?: true
    totalLikes?: true
    totalReshares?: true
    totalComments?: true
    influenceRank?: true
    categoryRank?: true
  }

  export type InfluenceMetricsMinAggregateInputType = {
    id?: true
    userId?: true
    followerCount?: true
    followingCount?: true
    engagementRate?: true
    reachScore?: true
    approvalRating?: true
    controversyLevel?: true
    trendingScore?: true
    followerGrowthDaily?: true
    followerGrowthWeekly?: true
    followerGrowthMonthly?: true
    totalLikes?: true
    totalReshares?: true
    totalComments?: true
    influenceRank?: true
    categoryRank?: true
    lastUpdated?: true
    createdAt?: true
  }

  export type InfluenceMetricsMaxAggregateInputType = {
    id?: true
    userId?: true
    followerCount?: true
    followingCount?: true
    engagementRate?: true
    reachScore?: true
    approvalRating?: true
    controversyLevel?: true
    trendingScore?: true
    followerGrowthDaily?: true
    followerGrowthWeekly?: true
    followerGrowthMonthly?: true
    totalLikes?: true
    totalReshares?: true
    totalComments?: true
    influenceRank?: true
    categoryRank?: true
    lastUpdated?: true
    createdAt?: true
  }

  export type InfluenceMetricsCountAggregateInputType = {
    id?: true
    userId?: true
    followerCount?: true
    followingCount?: true
    engagementRate?: true
    reachScore?: true
    approvalRating?: true
    controversyLevel?: true
    trendingScore?: true
    followerGrowthDaily?: true
    followerGrowthWeekly?: true
    followerGrowthMonthly?: true
    totalLikes?: true
    totalReshares?: true
    totalComments?: true
    influenceRank?: true
    categoryRank?: true
    lastUpdated?: true
    createdAt?: true
    _all?: true
  }

  export type InfluenceMetricsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InfluenceMetrics to aggregate.
     */
    where?: InfluenceMetricsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InfluenceMetrics to fetch.
     */
    orderBy?: InfluenceMetricsOrderByWithRelationInput | InfluenceMetricsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InfluenceMetricsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InfluenceMetrics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InfluenceMetrics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned InfluenceMetrics
    **/
    _count?: true | InfluenceMetricsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: InfluenceMetricsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: InfluenceMetricsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InfluenceMetricsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InfluenceMetricsMaxAggregateInputType
  }

  export type GetInfluenceMetricsAggregateType<T extends InfluenceMetricsAggregateArgs> = {
        [P in keyof T & keyof AggregateInfluenceMetrics]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInfluenceMetrics[P]>
      : GetScalarType<T[P], AggregateInfluenceMetrics[P]>
  }




  export type InfluenceMetricsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InfluenceMetricsWhereInput
    orderBy?: InfluenceMetricsOrderByWithAggregationInput | InfluenceMetricsOrderByWithAggregationInput[]
    by: InfluenceMetricsScalarFieldEnum[] | InfluenceMetricsScalarFieldEnum
    having?: InfluenceMetricsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InfluenceMetricsCountAggregateInputType | true
    _avg?: InfluenceMetricsAvgAggregateInputType
    _sum?: InfluenceMetricsSumAggregateInputType
    _min?: InfluenceMetricsMinAggregateInputType
    _max?: InfluenceMetricsMaxAggregateInputType
  }

  export type InfluenceMetricsGroupByOutputType = {
    id: string
    userId: string
    followerCount: number
    followingCount: number
    engagementRate: number
    reachScore: number
    approvalRating: number
    controversyLevel: number
    trendingScore: number
    followerGrowthDaily: number
    followerGrowthWeekly: number
    followerGrowthMonthly: number
    totalLikes: number
    totalReshares: number
    totalComments: number
    influenceRank: number
    categoryRank: number
    lastUpdated: Date
    createdAt: Date
    _count: InfluenceMetricsCountAggregateOutputType | null
    _avg: InfluenceMetricsAvgAggregateOutputType | null
    _sum: InfluenceMetricsSumAggregateOutputType | null
    _min: InfluenceMetricsMinAggregateOutputType | null
    _max: InfluenceMetricsMaxAggregateOutputType | null
  }

  type GetInfluenceMetricsGroupByPayload<T extends InfluenceMetricsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InfluenceMetricsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InfluenceMetricsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InfluenceMetricsGroupByOutputType[P]>
            : GetScalarType<T[P], InfluenceMetricsGroupByOutputType[P]>
        }
      >
    >


  export type InfluenceMetricsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    followerCount?: boolean
    followingCount?: boolean
    engagementRate?: boolean
    reachScore?: boolean
    approvalRating?: boolean
    controversyLevel?: boolean
    trendingScore?: boolean
    followerGrowthDaily?: boolean
    followerGrowthWeekly?: boolean
    followerGrowthMonthly?: boolean
    totalLikes?: boolean
    totalReshares?: boolean
    totalComments?: boolean
    influenceRank?: boolean
    categoryRank?: boolean
    lastUpdated?: boolean
    createdAt?: boolean
    user?: boolean | UserAccountDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["influenceMetrics"]>

  export type InfluenceMetricsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    followerCount?: boolean
    followingCount?: boolean
    engagementRate?: boolean
    reachScore?: boolean
    approvalRating?: boolean
    controversyLevel?: boolean
    trendingScore?: boolean
    followerGrowthDaily?: boolean
    followerGrowthWeekly?: boolean
    followerGrowthMonthly?: boolean
    totalLikes?: boolean
    totalReshares?: boolean
    totalComments?: boolean
    influenceRank?: boolean
    categoryRank?: boolean
    lastUpdated?: boolean
    createdAt?: boolean
    user?: boolean | UserAccountDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["influenceMetrics"]>

  export type InfluenceMetricsSelectScalar = {
    id?: boolean
    userId?: boolean
    followerCount?: boolean
    followingCount?: boolean
    engagementRate?: boolean
    reachScore?: boolean
    approvalRating?: boolean
    controversyLevel?: boolean
    trendingScore?: boolean
    followerGrowthDaily?: boolean
    followerGrowthWeekly?: boolean
    followerGrowthMonthly?: boolean
    totalLikes?: boolean
    totalReshares?: boolean
    totalComments?: boolean
    influenceRank?: boolean
    categoryRank?: boolean
    lastUpdated?: boolean
    createdAt?: boolean
  }

  export type InfluenceMetricsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserAccountDefaultArgs<ExtArgs>
  }
  export type InfluenceMetricsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserAccountDefaultArgs<ExtArgs>
  }

  export type $InfluenceMetricsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "InfluenceMetrics"
    objects: {
      user: Prisma.$UserAccountPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      followerCount: number
      followingCount: number
      engagementRate: number
      reachScore: number
      approvalRating: number
      controversyLevel: number
      trendingScore: number
      followerGrowthDaily: number
      followerGrowthWeekly: number
      followerGrowthMonthly: number
      totalLikes: number
      totalReshares: number
      totalComments: number
      influenceRank: number
      categoryRank: number
      lastUpdated: Date
      createdAt: Date
    }, ExtArgs["result"]["influenceMetrics"]>
    composites: {}
  }

  type InfluenceMetricsGetPayload<S extends boolean | null | undefined | InfluenceMetricsDefaultArgs> = $Result.GetResult<Prisma.$InfluenceMetricsPayload, S>

  type InfluenceMetricsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<InfluenceMetricsFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: InfluenceMetricsCountAggregateInputType | true
    }

  export interface InfluenceMetricsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['InfluenceMetrics'], meta: { name: 'InfluenceMetrics' } }
    /**
     * Find zero or one InfluenceMetrics that matches the filter.
     * @param {InfluenceMetricsFindUniqueArgs} args - Arguments to find a InfluenceMetrics
     * @example
     * // Get one InfluenceMetrics
     * const influenceMetrics = await prisma.influenceMetrics.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InfluenceMetricsFindUniqueArgs>(args: SelectSubset<T, InfluenceMetricsFindUniqueArgs<ExtArgs>>): Prisma__InfluenceMetricsClient<$Result.GetResult<Prisma.$InfluenceMetricsPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one InfluenceMetrics that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {InfluenceMetricsFindUniqueOrThrowArgs} args - Arguments to find a InfluenceMetrics
     * @example
     * // Get one InfluenceMetrics
     * const influenceMetrics = await prisma.influenceMetrics.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InfluenceMetricsFindUniqueOrThrowArgs>(args: SelectSubset<T, InfluenceMetricsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InfluenceMetricsClient<$Result.GetResult<Prisma.$InfluenceMetricsPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first InfluenceMetrics that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InfluenceMetricsFindFirstArgs} args - Arguments to find a InfluenceMetrics
     * @example
     * // Get one InfluenceMetrics
     * const influenceMetrics = await prisma.influenceMetrics.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InfluenceMetricsFindFirstArgs>(args?: SelectSubset<T, InfluenceMetricsFindFirstArgs<ExtArgs>>): Prisma__InfluenceMetricsClient<$Result.GetResult<Prisma.$InfluenceMetricsPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first InfluenceMetrics that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InfluenceMetricsFindFirstOrThrowArgs} args - Arguments to find a InfluenceMetrics
     * @example
     * // Get one InfluenceMetrics
     * const influenceMetrics = await prisma.influenceMetrics.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InfluenceMetricsFindFirstOrThrowArgs>(args?: SelectSubset<T, InfluenceMetricsFindFirstOrThrowArgs<ExtArgs>>): Prisma__InfluenceMetricsClient<$Result.GetResult<Prisma.$InfluenceMetricsPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more InfluenceMetrics that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InfluenceMetricsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all InfluenceMetrics
     * const influenceMetrics = await prisma.influenceMetrics.findMany()
     * 
     * // Get first 10 InfluenceMetrics
     * const influenceMetrics = await prisma.influenceMetrics.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const influenceMetricsWithIdOnly = await prisma.influenceMetrics.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends InfluenceMetricsFindManyArgs>(args?: SelectSubset<T, InfluenceMetricsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InfluenceMetricsPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a InfluenceMetrics.
     * @param {InfluenceMetricsCreateArgs} args - Arguments to create a InfluenceMetrics.
     * @example
     * // Create one InfluenceMetrics
     * const InfluenceMetrics = await prisma.influenceMetrics.create({
     *   data: {
     *     // ... data to create a InfluenceMetrics
     *   }
     * })
     * 
     */
    create<T extends InfluenceMetricsCreateArgs>(args: SelectSubset<T, InfluenceMetricsCreateArgs<ExtArgs>>): Prisma__InfluenceMetricsClient<$Result.GetResult<Prisma.$InfluenceMetricsPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many InfluenceMetrics.
     * @param {InfluenceMetricsCreateManyArgs} args - Arguments to create many InfluenceMetrics.
     * @example
     * // Create many InfluenceMetrics
     * const influenceMetrics = await prisma.influenceMetrics.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InfluenceMetricsCreateManyArgs>(args?: SelectSubset<T, InfluenceMetricsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many InfluenceMetrics and returns the data saved in the database.
     * @param {InfluenceMetricsCreateManyAndReturnArgs} args - Arguments to create many InfluenceMetrics.
     * @example
     * // Create many InfluenceMetrics
     * const influenceMetrics = await prisma.influenceMetrics.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many InfluenceMetrics and only return the `id`
     * const influenceMetricsWithIdOnly = await prisma.influenceMetrics.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends InfluenceMetricsCreateManyAndReturnArgs>(args?: SelectSubset<T, InfluenceMetricsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InfluenceMetricsPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a InfluenceMetrics.
     * @param {InfluenceMetricsDeleteArgs} args - Arguments to delete one InfluenceMetrics.
     * @example
     * // Delete one InfluenceMetrics
     * const InfluenceMetrics = await prisma.influenceMetrics.delete({
     *   where: {
     *     // ... filter to delete one InfluenceMetrics
     *   }
     * })
     * 
     */
    delete<T extends InfluenceMetricsDeleteArgs>(args: SelectSubset<T, InfluenceMetricsDeleteArgs<ExtArgs>>): Prisma__InfluenceMetricsClient<$Result.GetResult<Prisma.$InfluenceMetricsPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one InfluenceMetrics.
     * @param {InfluenceMetricsUpdateArgs} args - Arguments to update one InfluenceMetrics.
     * @example
     * // Update one InfluenceMetrics
     * const influenceMetrics = await prisma.influenceMetrics.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InfluenceMetricsUpdateArgs>(args: SelectSubset<T, InfluenceMetricsUpdateArgs<ExtArgs>>): Prisma__InfluenceMetricsClient<$Result.GetResult<Prisma.$InfluenceMetricsPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more InfluenceMetrics.
     * @param {InfluenceMetricsDeleteManyArgs} args - Arguments to filter InfluenceMetrics to delete.
     * @example
     * // Delete a few InfluenceMetrics
     * const { count } = await prisma.influenceMetrics.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InfluenceMetricsDeleteManyArgs>(args?: SelectSubset<T, InfluenceMetricsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more InfluenceMetrics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InfluenceMetricsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many InfluenceMetrics
     * const influenceMetrics = await prisma.influenceMetrics.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InfluenceMetricsUpdateManyArgs>(args: SelectSubset<T, InfluenceMetricsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one InfluenceMetrics.
     * @param {InfluenceMetricsUpsertArgs} args - Arguments to update or create a InfluenceMetrics.
     * @example
     * // Update or create a InfluenceMetrics
     * const influenceMetrics = await prisma.influenceMetrics.upsert({
     *   create: {
     *     // ... data to create a InfluenceMetrics
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the InfluenceMetrics we want to update
     *   }
     * })
     */
    upsert<T extends InfluenceMetricsUpsertArgs>(args: SelectSubset<T, InfluenceMetricsUpsertArgs<ExtArgs>>): Prisma__InfluenceMetricsClient<$Result.GetResult<Prisma.$InfluenceMetricsPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of InfluenceMetrics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InfluenceMetricsCountArgs} args - Arguments to filter InfluenceMetrics to count.
     * @example
     * // Count the number of InfluenceMetrics
     * const count = await prisma.influenceMetrics.count({
     *   where: {
     *     // ... the filter for the InfluenceMetrics we want to count
     *   }
     * })
    **/
    count<T extends InfluenceMetricsCountArgs>(
      args?: Subset<T, InfluenceMetricsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InfluenceMetricsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a InfluenceMetrics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InfluenceMetricsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends InfluenceMetricsAggregateArgs>(args: Subset<T, InfluenceMetricsAggregateArgs>): Prisma.PrismaPromise<GetInfluenceMetricsAggregateType<T>>

    /**
     * Group by InfluenceMetrics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InfluenceMetricsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends InfluenceMetricsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InfluenceMetricsGroupByArgs['orderBy'] }
        : { orderBy?: InfluenceMetricsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, InfluenceMetricsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInfluenceMetricsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the InfluenceMetrics model
   */
  readonly fields: InfluenceMetricsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for InfluenceMetrics.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InfluenceMetricsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserAccountDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserAccountDefaultArgs<ExtArgs>>): Prisma__UserAccountClient<$Result.GetResult<Prisma.$UserAccountPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the InfluenceMetrics model
   */ 
  interface InfluenceMetricsFieldRefs {
    readonly id: FieldRef<"InfluenceMetrics", 'String'>
    readonly userId: FieldRef<"InfluenceMetrics", 'String'>
    readonly followerCount: FieldRef<"InfluenceMetrics", 'Int'>
    readonly followingCount: FieldRef<"InfluenceMetrics", 'Int'>
    readonly engagementRate: FieldRef<"InfluenceMetrics", 'Float'>
    readonly reachScore: FieldRef<"InfluenceMetrics", 'Int'>
    readonly approvalRating: FieldRef<"InfluenceMetrics", 'Int'>
    readonly controversyLevel: FieldRef<"InfluenceMetrics", 'Int'>
    readonly trendingScore: FieldRef<"InfluenceMetrics", 'Int'>
    readonly followerGrowthDaily: FieldRef<"InfluenceMetrics", 'Int'>
    readonly followerGrowthWeekly: FieldRef<"InfluenceMetrics", 'Int'>
    readonly followerGrowthMonthly: FieldRef<"InfluenceMetrics", 'Int'>
    readonly totalLikes: FieldRef<"InfluenceMetrics", 'Int'>
    readonly totalReshares: FieldRef<"InfluenceMetrics", 'Int'>
    readonly totalComments: FieldRef<"InfluenceMetrics", 'Int'>
    readonly influenceRank: FieldRef<"InfluenceMetrics", 'Int'>
    readonly categoryRank: FieldRef<"InfluenceMetrics", 'Int'>
    readonly lastUpdated: FieldRef<"InfluenceMetrics", 'DateTime'>
    readonly createdAt: FieldRef<"InfluenceMetrics", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * InfluenceMetrics findUnique
   */
  export type InfluenceMetricsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InfluenceMetrics
     */
    select?: InfluenceMetricsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InfluenceMetricsInclude<ExtArgs> | null
    /**
     * Filter, which InfluenceMetrics to fetch.
     */
    where: InfluenceMetricsWhereUniqueInput
  }

  /**
   * InfluenceMetrics findUniqueOrThrow
   */
  export type InfluenceMetricsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InfluenceMetrics
     */
    select?: InfluenceMetricsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InfluenceMetricsInclude<ExtArgs> | null
    /**
     * Filter, which InfluenceMetrics to fetch.
     */
    where: InfluenceMetricsWhereUniqueInput
  }

  /**
   * InfluenceMetrics findFirst
   */
  export type InfluenceMetricsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InfluenceMetrics
     */
    select?: InfluenceMetricsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InfluenceMetricsInclude<ExtArgs> | null
    /**
     * Filter, which InfluenceMetrics to fetch.
     */
    where?: InfluenceMetricsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InfluenceMetrics to fetch.
     */
    orderBy?: InfluenceMetricsOrderByWithRelationInput | InfluenceMetricsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InfluenceMetrics.
     */
    cursor?: InfluenceMetricsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InfluenceMetrics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InfluenceMetrics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InfluenceMetrics.
     */
    distinct?: InfluenceMetricsScalarFieldEnum | InfluenceMetricsScalarFieldEnum[]
  }

  /**
   * InfluenceMetrics findFirstOrThrow
   */
  export type InfluenceMetricsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InfluenceMetrics
     */
    select?: InfluenceMetricsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InfluenceMetricsInclude<ExtArgs> | null
    /**
     * Filter, which InfluenceMetrics to fetch.
     */
    where?: InfluenceMetricsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InfluenceMetrics to fetch.
     */
    orderBy?: InfluenceMetricsOrderByWithRelationInput | InfluenceMetricsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InfluenceMetrics.
     */
    cursor?: InfluenceMetricsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InfluenceMetrics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InfluenceMetrics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InfluenceMetrics.
     */
    distinct?: InfluenceMetricsScalarFieldEnum | InfluenceMetricsScalarFieldEnum[]
  }

  /**
   * InfluenceMetrics findMany
   */
  export type InfluenceMetricsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InfluenceMetrics
     */
    select?: InfluenceMetricsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InfluenceMetricsInclude<ExtArgs> | null
    /**
     * Filter, which InfluenceMetrics to fetch.
     */
    where?: InfluenceMetricsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InfluenceMetrics to fetch.
     */
    orderBy?: InfluenceMetricsOrderByWithRelationInput | InfluenceMetricsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing InfluenceMetrics.
     */
    cursor?: InfluenceMetricsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InfluenceMetrics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InfluenceMetrics.
     */
    skip?: number
    distinct?: InfluenceMetricsScalarFieldEnum | InfluenceMetricsScalarFieldEnum[]
  }

  /**
   * InfluenceMetrics create
   */
  export type InfluenceMetricsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InfluenceMetrics
     */
    select?: InfluenceMetricsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InfluenceMetricsInclude<ExtArgs> | null
    /**
     * The data needed to create a InfluenceMetrics.
     */
    data: XOR<InfluenceMetricsCreateInput, InfluenceMetricsUncheckedCreateInput>
  }

  /**
   * InfluenceMetrics createMany
   */
  export type InfluenceMetricsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many InfluenceMetrics.
     */
    data: InfluenceMetricsCreateManyInput | InfluenceMetricsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * InfluenceMetrics createManyAndReturn
   */
  export type InfluenceMetricsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InfluenceMetrics
     */
    select?: InfluenceMetricsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many InfluenceMetrics.
     */
    data: InfluenceMetricsCreateManyInput | InfluenceMetricsCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InfluenceMetricsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * InfluenceMetrics update
   */
  export type InfluenceMetricsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InfluenceMetrics
     */
    select?: InfluenceMetricsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InfluenceMetricsInclude<ExtArgs> | null
    /**
     * The data needed to update a InfluenceMetrics.
     */
    data: XOR<InfluenceMetricsUpdateInput, InfluenceMetricsUncheckedUpdateInput>
    /**
     * Choose, which InfluenceMetrics to update.
     */
    where: InfluenceMetricsWhereUniqueInput
  }

  /**
   * InfluenceMetrics updateMany
   */
  export type InfluenceMetricsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update InfluenceMetrics.
     */
    data: XOR<InfluenceMetricsUpdateManyMutationInput, InfluenceMetricsUncheckedUpdateManyInput>
    /**
     * Filter which InfluenceMetrics to update
     */
    where?: InfluenceMetricsWhereInput
  }

  /**
   * InfluenceMetrics upsert
   */
  export type InfluenceMetricsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InfluenceMetrics
     */
    select?: InfluenceMetricsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InfluenceMetricsInclude<ExtArgs> | null
    /**
     * The filter to search for the InfluenceMetrics to update in case it exists.
     */
    where: InfluenceMetricsWhereUniqueInput
    /**
     * In case the InfluenceMetrics found by the `where` argument doesn't exist, create a new InfluenceMetrics with this data.
     */
    create: XOR<InfluenceMetricsCreateInput, InfluenceMetricsUncheckedCreateInput>
    /**
     * In case the InfluenceMetrics was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InfluenceMetricsUpdateInput, InfluenceMetricsUncheckedUpdateInput>
  }

  /**
   * InfluenceMetrics delete
   */
  export type InfluenceMetricsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InfluenceMetrics
     */
    select?: InfluenceMetricsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InfluenceMetricsInclude<ExtArgs> | null
    /**
     * Filter which InfluenceMetrics to delete.
     */
    where: InfluenceMetricsWhereUniqueInput
  }

  /**
   * InfluenceMetrics deleteMany
   */
  export type InfluenceMetricsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InfluenceMetrics to delete
     */
    where?: InfluenceMetricsWhereInput
  }

  /**
   * InfluenceMetrics without action
   */
  export type InfluenceMetricsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InfluenceMetrics
     */
    select?: InfluenceMetricsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InfluenceMetricsInclude<ExtArgs> | null
  }


  /**
   * Model Settings
   */

  export type AggregateSettings = {
    _count: SettingsCountAggregateOutputType | null
    _avg: SettingsAvgAggregateOutputType | null
    _sum: SettingsSumAggregateOutputType | null
    _min: SettingsMinAggregateOutputType | null
    _max: SettingsMaxAggregateOutputType | null
  }

  export type SettingsAvgAggregateOutputType = {
    aiChatterLevel: number | null
  }

  export type SettingsSumAggregateOutputType = {
    aiChatterLevel: number | null
  }

  export type SettingsMinAggregateOutputType = {
    id: string | null
    userId: string | null
    newsRegion: string | null
    aiChatterLevel: number | null
    aiResponseTone: $Enums.ToneStyle | null
    emailNotifications: boolean | null
    pushNotifications: boolean | null
    profileVisibility: $Enums.ProfileVisibility | null
    allowPersonaInteractions: boolean | null
    allowDataForAI: boolean | null
    theme: $Enums.Theme | null
    language: string | null
    timezone: string | null
    customAIApiKey: string | null
    customAIBaseUrl: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SettingsMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    newsRegion: string | null
    aiChatterLevel: number | null
    aiResponseTone: $Enums.ToneStyle | null
    emailNotifications: boolean | null
    pushNotifications: boolean | null
    profileVisibility: $Enums.ProfileVisibility | null
    allowPersonaInteractions: boolean | null
    allowDataForAI: boolean | null
    theme: $Enums.Theme | null
    language: string | null
    timezone: string | null
    customAIApiKey: string | null
    customAIBaseUrl: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SettingsCountAggregateOutputType = {
    id: number
    userId: number
    newsRegion: number
    newsCategories: number
    newsLanguages: number
    aiChatterLevel: number
    aiPersonalities: number
    aiResponseTone: number
    emailNotifications: number
    pushNotifications: number
    notificationCategories: number
    profileVisibility: number
    allowPersonaInteractions: number
    allowDataForAI: number
    theme: number
    language: number
    timezone: number
    customAIApiKey: number
    customAIBaseUrl: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SettingsAvgAggregateInputType = {
    aiChatterLevel?: true
  }

  export type SettingsSumAggregateInputType = {
    aiChatterLevel?: true
  }

  export type SettingsMinAggregateInputType = {
    id?: true
    userId?: true
    newsRegion?: true
    aiChatterLevel?: true
    aiResponseTone?: true
    emailNotifications?: true
    pushNotifications?: true
    profileVisibility?: true
    allowPersonaInteractions?: true
    allowDataForAI?: true
    theme?: true
    language?: true
    timezone?: true
    customAIApiKey?: true
    customAIBaseUrl?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SettingsMaxAggregateInputType = {
    id?: true
    userId?: true
    newsRegion?: true
    aiChatterLevel?: true
    aiResponseTone?: true
    emailNotifications?: true
    pushNotifications?: true
    profileVisibility?: true
    allowPersonaInteractions?: true
    allowDataForAI?: true
    theme?: true
    language?: true
    timezone?: true
    customAIApiKey?: true
    customAIBaseUrl?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SettingsCountAggregateInputType = {
    id?: true
    userId?: true
    newsRegion?: true
    newsCategories?: true
    newsLanguages?: true
    aiChatterLevel?: true
    aiPersonalities?: true
    aiResponseTone?: true
    emailNotifications?: true
    pushNotifications?: true
    notificationCategories?: true
    profileVisibility?: true
    allowPersonaInteractions?: true
    allowDataForAI?: true
    theme?: true
    language?: true
    timezone?: true
    customAIApiKey?: true
    customAIBaseUrl?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SettingsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Settings to aggregate.
     */
    where?: SettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Settings to fetch.
     */
    orderBy?: SettingsOrderByWithRelationInput | SettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Settings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Settings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Settings
    **/
    _count?: true | SettingsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SettingsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SettingsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SettingsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SettingsMaxAggregateInputType
  }

  export type GetSettingsAggregateType<T extends SettingsAggregateArgs> = {
        [P in keyof T & keyof AggregateSettings]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSettings[P]>
      : GetScalarType<T[P], AggregateSettings[P]>
  }




  export type SettingsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SettingsWhereInput
    orderBy?: SettingsOrderByWithAggregationInput | SettingsOrderByWithAggregationInput[]
    by: SettingsScalarFieldEnum[] | SettingsScalarFieldEnum
    having?: SettingsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SettingsCountAggregateInputType | true
    _avg?: SettingsAvgAggregateInputType
    _sum?: SettingsSumAggregateInputType
    _min?: SettingsMinAggregateInputType
    _max?: SettingsMaxAggregateInputType
  }

  export type SettingsGroupByOutputType = {
    id: string
    userId: string
    newsRegion: string
    newsCategories: $Enums.NewsCategory[]
    newsLanguages: string[]
    aiChatterLevel: number
    aiPersonalities: string[]
    aiResponseTone: $Enums.ToneStyle
    emailNotifications: boolean
    pushNotifications: boolean
    notificationCategories: $Enums.NotificationCategory[]
    profileVisibility: $Enums.ProfileVisibility
    allowPersonaInteractions: boolean
    allowDataForAI: boolean
    theme: $Enums.Theme
    language: string
    timezone: string
    customAIApiKey: string | null
    customAIBaseUrl: string | null
    createdAt: Date
    updatedAt: Date
    _count: SettingsCountAggregateOutputType | null
    _avg: SettingsAvgAggregateOutputType | null
    _sum: SettingsSumAggregateOutputType | null
    _min: SettingsMinAggregateOutputType | null
    _max: SettingsMaxAggregateOutputType | null
  }

  type GetSettingsGroupByPayload<T extends SettingsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SettingsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SettingsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SettingsGroupByOutputType[P]>
            : GetScalarType<T[P], SettingsGroupByOutputType[P]>
        }
      >
    >


  export type SettingsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    newsRegion?: boolean
    newsCategories?: boolean
    newsLanguages?: boolean
    aiChatterLevel?: boolean
    aiPersonalities?: boolean
    aiResponseTone?: boolean
    emailNotifications?: boolean
    pushNotifications?: boolean
    notificationCategories?: boolean
    profileVisibility?: boolean
    allowPersonaInteractions?: boolean
    allowDataForAI?: boolean
    theme?: boolean
    language?: boolean
    timezone?: boolean
    customAIApiKey?: boolean
    customAIBaseUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserAccountDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["settings"]>

  export type SettingsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    newsRegion?: boolean
    newsCategories?: boolean
    newsLanguages?: boolean
    aiChatterLevel?: boolean
    aiPersonalities?: boolean
    aiResponseTone?: boolean
    emailNotifications?: boolean
    pushNotifications?: boolean
    notificationCategories?: boolean
    profileVisibility?: boolean
    allowPersonaInteractions?: boolean
    allowDataForAI?: boolean
    theme?: boolean
    language?: boolean
    timezone?: boolean
    customAIApiKey?: boolean
    customAIBaseUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserAccountDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["settings"]>

  export type SettingsSelectScalar = {
    id?: boolean
    userId?: boolean
    newsRegion?: boolean
    newsCategories?: boolean
    newsLanguages?: boolean
    aiChatterLevel?: boolean
    aiPersonalities?: boolean
    aiResponseTone?: boolean
    emailNotifications?: boolean
    pushNotifications?: boolean
    notificationCategories?: boolean
    profileVisibility?: boolean
    allowPersonaInteractions?: boolean
    allowDataForAI?: boolean
    theme?: boolean
    language?: boolean
    timezone?: boolean
    customAIApiKey?: boolean
    customAIBaseUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SettingsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserAccountDefaultArgs<ExtArgs>
  }
  export type SettingsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserAccountDefaultArgs<ExtArgs>
  }

  export type $SettingsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Settings"
    objects: {
      user: Prisma.$UserAccountPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      newsRegion: string
      newsCategories: $Enums.NewsCategory[]
      newsLanguages: string[]
      aiChatterLevel: number
      aiPersonalities: string[]
      aiResponseTone: $Enums.ToneStyle
      emailNotifications: boolean
      pushNotifications: boolean
      notificationCategories: $Enums.NotificationCategory[]
      profileVisibility: $Enums.ProfileVisibility
      allowPersonaInteractions: boolean
      allowDataForAI: boolean
      theme: $Enums.Theme
      language: string
      timezone: string
      customAIApiKey: string | null
      customAIBaseUrl: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["settings"]>
    composites: {}
  }

  type SettingsGetPayload<S extends boolean | null | undefined | SettingsDefaultArgs> = $Result.GetResult<Prisma.$SettingsPayload, S>

  type SettingsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SettingsFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SettingsCountAggregateInputType | true
    }

  export interface SettingsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Settings'], meta: { name: 'Settings' } }
    /**
     * Find zero or one Settings that matches the filter.
     * @param {SettingsFindUniqueArgs} args - Arguments to find a Settings
     * @example
     * // Get one Settings
     * const settings = await prisma.settings.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SettingsFindUniqueArgs>(args: SelectSubset<T, SettingsFindUniqueArgs<ExtArgs>>): Prisma__SettingsClient<$Result.GetResult<Prisma.$SettingsPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Settings that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SettingsFindUniqueOrThrowArgs} args - Arguments to find a Settings
     * @example
     * // Get one Settings
     * const settings = await prisma.settings.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SettingsFindUniqueOrThrowArgs>(args: SelectSubset<T, SettingsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SettingsClient<$Result.GetResult<Prisma.$SettingsPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Settings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingsFindFirstArgs} args - Arguments to find a Settings
     * @example
     * // Get one Settings
     * const settings = await prisma.settings.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SettingsFindFirstArgs>(args?: SelectSubset<T, SettingsFindFirstArgs<ExtArgs>>): Prisma__SettingsClient<$Result.GetResult<Prisma.$SettingsPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Settings that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingsFindFirstOrThrowArgs} args - Arguments to find a Settings
     * @example
     * // Get one Settings
     * const settings = await prisma.settings.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SettingsFindFirstOrThrowArgs>(args?: SelectSubset<T, SettingsFindFirstOrThrowArgs<ExtArgs>>): Prisma__SettingsClient<$Result.GetResult<Prisma.$SettingsPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Settings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Settings
     * const settings = await prisma.settings.findMany()
     * 
     * // Get first 10 Settings
     * const settings = await prisma.settings.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const settingsWithIdOnly = await prisma.settings.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SettingsFindManyArgs>(args?: SelectSubset<T, SettingsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SettingsPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Settings.
     * @param {SettingsCreateArgs} args - Arguments to create a Settings.
     * @example
     * // Create one Settings
     * const Settings = await prisma.settings.create({
     *   data: {
     *     // ... data to create a Settings
     *   }
     * })
     * 
     */
    create<T extends SettingsCreateArgs>(args: SelectSubset<T, SettingsCreateArgs<ExtArgs>>): Prisma__SettingsClient<$Result.GetResult<Prisma.$SettingsPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Settings.
     * @param {SettingsCreateManyArgs} args - Arguments to create many Settings.
     * @example
     * // Create many Settings
     * const settings = await prisma.settings.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SettingsCreateManyArgs>(args?: SelectSubset<T, SettingsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Settings and returns the data saved in the database.
     * @param {SettingsCreateManyAndReturnArgs} args - Arguments to create many Settings.
     * @example
     * // Create many Settings
     * const settings = await prisma.settings.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Settings and only return the `id`
     * const settingsWithIdOnly = await prisma.settings.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SettingsCreateManyAndReturnArgs>(args?: SelectSubset<T, SettingsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SettingsPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Settings.
     * @param {SettingsDeleteArgs} args - Arguments to delete one Settings.
     * @example
     * // Delete one Settings
     * const Settings = await prisma.settings.delete({
     *   where: {
     *     // ... filter to delete one Settings
     *   }
     * })
     * 
     */
    delete<T extends SettingsDeleteArgs>(args: SelectSubset<T, SettingsDeleteArgs<ExtArgs>>): Prisma__SettingsClient<$Result.GetResult<Prisma.$SettingsPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Settings.
     * @param {SettingsUpdateArgs} args - Arguments to update one Settings.
     * @example
     * // Update one Settings
     * const settings = await prisma.settings.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SettingsUpdateArgs>(args: SelectSubset<T, SettingsUpdateArgs<ExtArgs>>): Prisma__SettingsClient<$Result.GetResult<Prisma.$SettingsPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Settings.
     * @param {SettingsDeleteManyArgs} args - Arguments to filter Settings to delete.
     * @example
     * // Delete a few Settings
     * const { count } = await prisma.settings.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SettingsDeleteManyArgs>(args?: SelectSubset<T, SettingsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Settings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Settings
     * const settings = await prisma.settings.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SettingsUpdateManyArgs>(args: SelectSubset<T, SettingsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Settings.
     * @param {SettingsUpsertArgs} args - Arguments to update or create a Settings.
     * @example
     * // Update or create a Settings
     * const settings = await prisma.settings.upsert({
     *   create: {
     *     // ... data to create a Settings
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Settings we want to update
     *   }
     * })
     */
    upsert<T extends SettingsUpsertArgs>(args: SelectSubset<T, SettingsUpsertArgs<ExtArgs>>): Prisma__SettingsClient<$Result.GetResult<Prisma.$SettingsPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Settings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingsCountArgs} args - Arguments to filter Settings to count.
     * @example
     * // Count the number of Settings
     * const count = await prisma.settings.count({
     *   where: {
     *     // ... the filter for the Settings we want to count
     *   }
     * })
    **/
    count<T extends SettingsCountArgs>(
      args?: Subset<T, SettingsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SettingsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Settings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SettingsAggregateArgs>(args: Subset<T, SettingsAggregateArgs>): Prisma.PrismaPromise<GetSettingsAggregateType<T>>

    /**
     * Group by Settings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SettingsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SettingsGroupByArgs['orderBy'] }
        : { orderBy?: SettingsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SettingsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSettingsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Settings model
   */
  readonly fields: SettingsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Settings.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SettingsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserAccountDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserAccountDefaultArgs<ExtArgs>>): Prisma__UserAccountClient<$Result.GetResult<Prisma.$UserAccountPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Settings model
   */ 
  interface SettingsFieldRefs {
    readonly id: FieldRef<"Settings", 'String'>
    readonly userId: FieldRef<"Settings", 'String'>
    readonly newsRegion: FieldRef<"Settings", 'String'>
    readonly newsCategories: FieldRef<"Settings", 'NewsCategory[]'>
    readonly newsLanguages: FieldRef<"Settings", 'String[]'>
    readonly aiChatterLevel: FieldRef<"Settings", 'Int'>
    readonly aiPersonalities: FieldRef<"Settings", 'String[]'>
    readonly aiResponseTone: FieldRef<"Settings", 'ToneStyle'>
    readonly emailNotifications: FieldRef<"Settings", 'Boolean'>
    readonly pushNotifications: FieldRef<"Settings", 'Boolean'>
    readonly notificationCategories: FieldRef<"Settings", 'NotificationCategory[]'>
    readonly profileVisibility: FieldRef<"Settings", 'ProfileVisibility'>
    readonly allowPersonaInteractions: FieldRef<"Settings", 'Boolean'>
    readonly allowDataForAI: FieldRef<"Settings", 'Boolean'>
    readonly theme: FieldRef<"Settings", 'Theme'>
    readonly language: FieldRef<"Settings", 'String'>
    readonly timezone: FieldRef<"Settings", 'String'>
    readonly customAIApiKey: FieldRef<"Settings", 'String'>
    readonly customAIBaseUrl: FieldRef<"Settings", 'String'>
    readonly createdAt: FieldRef<"Settings", 'DateTime'>
    readonly updatedAt: FieldRef<"Settings", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Settings findUnique
   */
  export type SettingsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Settings
     */
    select?: SettingsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SettingsInclude<ExtArgs> | null
    /**
     * Filter, which Settings to fetch.
     */
    where: SettingsWhereUniqueInput
  }

  /**
   * Settings findUniqueOrThrow
   */
  export type SettingsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Settings
     */
    select?: SettingsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SettingsInclude<ExtArgs> | null
    /**
     * Filter, which Settings to fetch.
     */
    where: SettingsWhereUniqueInput
  }

  /**
   * Settings findFirst
   */
  export type SettingsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Settings
     */
    select?: SettingsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SettingsInclude<ExtArgs> | null
    /**
     * Filter, which Settings to fetch.
     */
    where?: SettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Settings to fetch.
     */
    orderBy?: SettingsOrderByWithRelationInput | SettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Settings.
     */
    cursor?: SettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Settings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Settings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Settings.
     */
    distinct?: SettingsScalarFieldEnum | SettingsScalarFieldEnum[]
  }

  /**
   * Settings findFirstOrThrow
   */
  export type SettingsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Settings
     */
    select?: SettingsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SettingsInclude<ExtArgs> | null
    /**
     * Filter, which Settings to fetch.
     */
    where?: SettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Settings to fetch.
     */
    orderBy?: SettingsOrderByWithRelationInput | SettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Settings.
     */
    cursor?: SettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Settings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Settings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Settings.
     */
    distinct?: SettingsScalarFieldEnum | SettingsScalarFieldEnum[]
  }

  /**
   * Settings findMany
   */
  export type SettingsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Settings
     */
    select?: SettingsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SettingsInclude<ExtArgs> | null
    /**
     * Filter, which Settings to fetch.
     */
    where?: SettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Settings to fetch.
     */
    orderBy?: SettingsOrderByWithRelationInput | SettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Settings.
     */
    cursor?: SettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Settings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Settings.
     */
    skip?: number
    distinct?: SettingsScalarFieldEnum | SettingsScalarFieldEnum[]
  }

  /**
   * Settings create
   */
  export type SettingsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Settings
     */
    select?: SettingsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SettingsInclude<ExtArgs> | null
    /**
     * The data needed to create a Settings.
     */
    data: XOR<SettingsCreateInput, SettingsUncheckedCreateInput>
  }

  /**
   * Settings createMany
   */
  export type SettingsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Settings.
     */
    data: SettingsCreateManyInput | SettingsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Settings createManyAndReturn
   */
  export type SettingsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Settings
     */
    select?: SettingsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Settings.
     */
    data: SettingsCreateManyInput | SettingsCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SettingsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Settings update
   */
  export type SettingsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Settings
     */
    select?: SettingsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SettingsInclude<ExtArgs> | null
    /**
     * The data needed to update a Settings.
     */
    data: XOR<SettingsUpdateInput, SettingsUncheckedUpdateInput>
    /**
     * Choose, which Settings to update.
     */
    where: SettingsWhereUniqueInput
  }

  /**
   * Settings updateMany
   */
  export type SettingsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Settings.
     */
    data: XOR<SettingsUpdateManyMutationInput, SettingsUncheckedUpdateManyInput>
    /**
     * Filter which Settings to update
     */
    where?: SettingsWhereInput
  }

  /**
   * Settings upsert
   */
  export type SettingsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Settings
     */
    select?: SettingsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SettingsInclude<ExtArgs> | null
    /**
     * The filter to search for the Settings to update in case it exists.
     */
    where: SettingsWhereUniqueInput
    /**
     * In case the Settings found by the `where` argument doesn't exist, create a new Settings with this data.
     */
    create: XOR<SettingsCreateInput, SettingsUncheckedCreateInput>
    /**
     * In case the Settings was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SettingsUpdateInput, SettingsUncheckedUpdateInput>
  }

  /**
   * Settings delete
   */
  export type SettingsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Settings
     */
    select?: SettingsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SettingsInclude<ExtArgs> | null
    /**
     * Filter which Settings to delete.
     */
    where: SettingsWhereUniqueInput
  }

  /**
   * Settings deleteMany
   */
  export type SettingsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Settings to delete
     */
    where?: SettingsWhereInput
  }

  /**
   * Settings without action
   */
  export type SettingsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Settings
     */
    select?: SettingsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SettingsInclude<ExtArgs> | null
  }


  /**
   * Model Post
   */

  export type AggregatePost = {
    _count: PostCountAggregateOutputType | null
    _avg: PostAvgAggregateOutputType | null
    _sum: PostSumAggregateOutputType | null
    _min: PostMinAggregateOutputType | null
    _max: PostMaxAggregateOutputType | null
  }

  export type PostAvgAggregateOutputType = {
    likeCount: number | null
    repostCount: number | null
    commentCount: number | null
    impressionCount: number | null
    reportCount: number | null
  }

  export type PostSumAggregateOutputType = {
    likeCount: number | null
    repostCount: number | null
    commentCount: number | null
    impressionCount: number | null
    reportCount: number | null
  }

  export type PostMinAggregateOutputType = {
    id: string | null
    authorId: string | null
    personaId: string | null
    content: string | null
    threadId: string | null
    parentPostId: string | null
    repostOfId: string | null
    isAIGenerated: boolean | null
    newsItemId: string | null
    newsContext: string | null
    likeCount: number | null
    repostCount: number | null
    commentCount: number | null
    impressionCount: number | null
    contentWarning: string | null
    isHidden: boolean | null
    reportCount: number | null
    publishedAt: Date | null
    editedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PostMaxAggregateOutputType = {
    id: string | null
    authorId: string | null
    personaId: string | null
    content: string | null
    threadId: string | null
    parentPostId: string | null
    repostOfId: string | null
    isAIGenerated: boolean | null
    newsItemId: string | null
    newsContext: string | null
    likeCount: number | null
    repostCount: number | null
    commentCount: number | null
    impressionCount: number | null
    contentWarning: string | null
    isHidden: boolean | null
    reportCount: number | null
    publishedAt: Date | null
    editedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PostCountAggregateOutputType = {
    id: number
    authorId: number
    personaId: number
    content: number
    mediaUrls: number
    linkPreview: number
    threadId: number
    parentPostId: number
    repostOfId: number
    isAIGenerated: number
    hashtags: number
    mentions: number
    newsItemId: number
    newsContext: number
    likeCount: number
    repostCount: number
    commentCount: number
    impressionCount: number
    contentWarning: number
    isHidden: number
    reportCount: number
    publishedAt: number
    editedAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PostAvgAggregateInputType = {
    likeCount?: true
    repostCount?: true
    commentCount?: true
    impressionCount?: true
    reportCount?: true
  }

  export type PostSumAggregateInputType = {
    likeCount?: true
    repostCount?: true
    commentCount?: true
    impressionCount?: true
    reportCount?: true
  }

  export type PostMinAggregateInputType = {
    id?: true
    authorId?: true
    personaId?: true
    content?: true
    threadId?: true
    parentPostId?: true
    repostOfId?: true
    isAIGenerated?: true
    newsItemId?: true
    newsContext?: true
    likeCount?: true
    repostCount?: true
    commentCount?: true
    impressionCount?: true
    contentWarning?: true
    isHidden?: true
    reportCount?: true
    publishedAt?: true
    editedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PostMaxAggregateInputType = {
    id?: true
    authorId?: true
    personaId?: true
    content?: true
    threadId?: true
    parentPostId?: true
    repostOfId?: true
    isAIGenerated?: true
    newsItemId?: true
    newsContext?: true
    likeCount?: true
    repostCount?: true
    commentCount?: true
    impressionCount?: true
    contentWarning?: true
    isHidden?: true
    reportCount?: true
    publishedAt?: true
    editedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PostCountAggregateInputType = {
    id?: true
    authorId?: true
    personaId?: true
    content?: true
    mediaUrls?: true
    linkPreview?: true
    threadId?: true
    parentPostId?: true
    repostOfId?: true
    isAIGenerated?: true
    hashtags?: true
    mentions?: true
    newsItemId?: true
    newsContext?: true
    likeCount?: true
    repostCount?: true
    commentCount?: true
    impressionCount?: true
    contentWarning?: true
    isHidden?: true
    reportCount?: true
    publishedAt?: true
    editedAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PostAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Post to aggregate.
     */
    where?: PostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Posts to fetch.
     */
    orderBy?: PostOrderByWithRelationInput | PostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Posts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Posts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Posts
    **/
    _count?: true | PostCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PostAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PostSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PostMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PostMaxAggregateInputType
  }

  export type GetPostAggregateType<T extends PostAggregateArgs> = {
        [P in keyof T & keyof AggregatePost]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePost[P]>
      : GetScalarType<T[P], AggregatePost[P]>
  }




  export type PostGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PostWhereInput
    orderBy?: PostOrderByWithAggregationInput | PostOrderByWithAggregationInput[]
    by: PostScalarFieldEnum[] | PostScalarFieldEnum
    having?: PostScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PostCountAggregateInputType | true
    _avg?: PostAvgAggregateInputType
    _sum?: PostSumAggregateInputType
    _min?: PostMinAggregateInputType
    _max?: PostMaxAggregateInputType
  }

  export type PostGroupByOutputType = {
    id: string
    authorId: string
    personaId: string | null
    content: string
    mediaUrls: string[]
    linkPreview: JsonValue | null
    threadId: string
    parentPostId: string | null
    repostOfId: string | null
    isAIGenerated: boolean
    hashtags: string[]
    mentions: string[]
    newsItemId: string | null
    newsContext: string | null
    likeCount: number
    repostCount: number
    commentCount: number
    impressionCount: number
    contentWarning: string | null
    isHidden: boolean
    reportCount: number
    publishedAt: Date
    editedAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: PostCountAggregateOutputType | null
    _avg: PostAvgAggregateOutputType | null
    _sum: PostSumAggregateOutputType | null
    _min: PostMinAggregateOutputType | null
    _max: PostMaxAggregateOutputType | null
  }

  type GetPostGroupByPayload<T extends PostGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PostGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PostGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PostGroupByOutputType[P]>
            : GetScalarType<T[P], PostGroupByOutputType[P]>
        }
      >
    >


  export type PostSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    authorId?: boolean
    personaId?: boolean
    content?: boolean
    mediaUrls?: boolean
    linkPreview?: boolean
    threadId?: boolean
    parentPostId?: boolean
    repostOfId?: boolean
    isAIGenerated?: boolean
    hashtags?: boolean
    mentions?: boolean
    newsItemId?: boolean
    newsContext?: boolean
    likeCount?: boolean
    repostCount?: boolean
    commentCount?: boolean
    impressionCount?: boolean
    contentWarning?: boolean
    isHidden?: boolean
    reportCount?: boolean
    publishedAt?: boolean
    editedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    author?: boolean | UserAccountDefaultArgs<ExtArgs>
    persona?: boolean | Post$personaArgs<ExtArgs>
    thread?: boolean | ThreadDefaultArgs<ExtArgs>
    parentPost?: boolean | Post$parentPostArgs<ExtArgs>
    repostOf?: boolean | Post$repostOfArgs<ExtArgs>
    newsItem?: boolean | Post$newsItemArgs<ExtArgs>
    replies?: boolean | Post$repliesArgs<ExtArgs>
    reposts?: boolean | Post$repostsArgs<ExtArgs>
    reactions?: boolean | Post$reactionsArgs<ExtArgs>
    _count?: boolean | PostCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["post"]>

  export type PostSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    authorId?: boolean
    personaId?: boolean
    content?: boolean
    mediaUrls?: boolean
    linkPreview?: boolean
    threadId?: boolean
    parentPostId?: boolean
    repostOfId?: boolean
    isAIGenerated?: boolean
    hashtags?: boolean
    mentions?: boolean
    newsItemId?: boolean
    newsContext?: boolean
    likeCount?: boolean
    repostCount?: boolean
    commentCount?: boolean
    impressionCount?: boolean
    contentWarning?: boolean
    isHidden?: boolean
    reportCount?: boolean
    publishedAt?: boolean
    editedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    author?: boolean | UserAccountDefaultArgs<ExtArgs>
    persona?: boolean | Post$personaArgs<ExtArgs>
    thread?: boolean | ThreadDefaultArgs<ExtArgs>
    parentPost?: boolean | Post$parentPostArgs<ExtArgs>
    repostOf?: boolean | Post$repostOfArgs<ExtArgs>
    newsItem?: boolean | Post$newsItemArgs<ExtArgs>
  }, ExtArgs["result"]["post"]>

  export type PostSelectScalar = {
    id?: boolean
    authorId?: boolean
    personaId?: boolean
    content?: boolean
    mediaUrls?: boolean
    linkPreview?: boolean
    threadId?: boolean
    parentPostId?: boolean
    repostOfId?: boolean
    isAIGenerated?: boolean
    hashtags?: boolean
    mentions?: boolean
    newsItemId?: boolean
    newsContext?: boolean
    likeCount?: boolean
    repostCount?: boolean
    commentCount?: boolean
    impressionCount?: boolean
    contentWarning?: boolean
    isHidden?: boolean
    reportCount?: boolean
    publishedAt?: boolean
    editedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PostInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    author?: boolean | UserAccountDefaultArgs<ExtArgs>
    persona?: boolean | Post$personaArgs<ExtArgs>
    thread?: boolean | ThreadDefaultArgs<ExtArgs>
    parentPost?: boolean | Post$parentPostArgs<ExtArgs>
    repostOf?: boolean | Post$repostOfArgs<ExtArgs>
    newsItem?: boolean | Post$newsItemArgs<ExtArgs>
    replies?: boolean | Post$repliesArgs<ExtArgs>
    reposts?: boolean | Post$repostsArgs<ExtArgs>
    reactions?: boolean | Post$reactionsArgs<ExtArgs>
    _count?: boolean | PostCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PostIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    author?: boolean | UserAccountDefaultArgs<ExtArgs>
    persona?: boolean | Post$personaArgs<ExtArgs>
    thread?: boolean | ThreadDefaultArgs<ExtArgs>
    parentPost?: boolean | Post$parentPostArgs<ExtArgs>
    repostOf?: boolean | Post$repostOfArgs<ExtArgs>
    newsItem?: boolean | Post$newsItemArgs<ExtArgs>
  }

  export type $PostPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Post"
    objects: {
      author: Prisma.$UserAccountPayload<ExtArgs>
      persona: Prisma.$PersonaPayload<ExtArgs> | null
      thread: Prisma.$ThreadPayload<ExtArgs>
      parentPost: Prisma.$PostPayload<ExtArgs> | null
      repostOf: Prisma.$PostPayload<ExtArgs> | null
      newsItem: Prisma.$NewsItemPayload<ExtArgs> | null
      replies: Prisma.$PostPayload<ExtArgs>[]
      reposts: Prisma.$PostPayload<ExtArgs>[]
      reactions: Prisma.$ReactionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      authorId: string
      personaId: string | null
      content: string
      mediaUrls: string[]
      linkPreview: Prisma.JsonValue | null
      threadId: string
      parentPostId: string | null
      repostOfId: string | null
      isAIGenerated: boolean
      hashtags: string[]
      mentions: string[]
      newsItemId: string | null
      newsContext: string | null
      likeCount: number
      repostCount: number
      commentCount: number
      impressionCount: number
      contentWarning: string | null
      isHidden: boolean
      reportCount: number
      publishedAt: Date
      editedAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["post"]>
    composites: {}
  }

  type PostGetPayload<S extends boolean | null | undefined | PostDefaultArgs> = $Result.GetResult<Prisma.$PostPayload, S>

  type PostCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PostFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PostCountAggregateInputType | true
    }

  export interface PostDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Post'], meta: { name: 'Post' } }
    /**
     * Find zero or one Post that matches the filter.
     * @param {PostFindUniqueArgs} args - Arguments to find a Post
     * @example
     * // Get one Post
     * const post = await prisma.post.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PostFindUniqueArgs>(args: SelectSubset<T, PostFindUniqueArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Post that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PostFindUniqueOrThrowArgs} args - Arguments to find a Post
     * @example
     * // Get one Post
     * const post = await prisma.post.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PostFindUniqueOrThrowArgs>(args: SelectSubset<T, PostFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Post that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostFindFirstArgs} args - Arguments to find a Post
     * @example
     * // Get one Post
     * const post = await prisma.post.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PostFindFirstArgs>(args?: SelectSubset<T, PostFindFirstArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Post that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostFindFirstOrThrowArgs} args - Arguments to find a Post
     * @example
     * // Get one Post
     * const post = await prisma.post.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PostFindFirstOrThrowArgs>(args?: SelectSubset<T, PostFindFirstOrThrowArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Posts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Posts
     * const posts = await prisma.post.findMany()
     * 
     * // Get first 10 Posts
     * const posts = await prisma.post.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const postWithIdOnly = await prisma.post.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PostFindManyArgs>(args?: SelectSubset<T, PostFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Post.
     * @param {PostCreateArgs} args - Arguments to create a Post.
     * @example
     * // Create one Post
     * const Post = await prisma.post.create({
     *   data: {
     *     // ... data to create a Post
     *   }
     * })
     * 
     */
    create<T extends PostCreateArgs>(args: SelectSubset<T, PostCreateArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Posts.
     * @param {PostCreateManyArgs} args - Arguments to create many Posts.
     * @example
     * // Create many Posts
     * const post = await prisma.post.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PostCreateManyArgs>(args?: SelectSubset<T, PostCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Posts and returns the data saved in the database.
     * @param {PostCreateManyAndReturnArgs} args - Arguments to create many Posts.
     * @example
     * // Create many Posts
     * const post = await prisma.post.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Posts and only return the `id`
     * const postWithIdOnly = await prisma.post.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PostCreateManyAndReturnArgs>(args?: SelectSubset<T, PostCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Post.
     * @param {PostDeleteArgs} args - Arguments to delete one Post.
     * @example
     * // Delete one Post
     * const Post = await prisma.post.delete({
     *   where: {
     *     // ... filter to delete one Post
     *   }
     * })
     * 
     */
    delete<T extends PostDeleteArgs>(args: SelectSubset<T, PostDeleteArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Post.
     * @param {PostUpdateArgs} args - Arguments to update one Post.
     * @example
     * // Update one Post
     * const post = await prisma.post.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PostUpdateArgs>(args: SelectSubset<T, PostUpdateArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Posts.
     * @param {PostDeleteManyArgs} args - Arguments to filter Posts to delete.
     * @example
     * // Delete a few Posts
     * const { count } = await prisma.post.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PostDeleteManyArgs>(args?: SelectSubset<T, PostDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Posts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Posts
     * const post = await prisma.post.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PostUpdateManyArgs>(args: SelectSubset<T, PostUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Post.
     * @param {PostUpsertArgs} args - Arguments to update or create a Post.
     * @example
     * // Update or create a Post
     * const post = await prisma.post.upsert({
     *   create: {
     *     // ... data to create a Post
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Post we want to update
     *   }
     * })
     */
    upsert<T extends PostUpsertArgs>(args: SelectSubset<T, PostUpsertArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Posts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostCountArgs} args - Arguments to filter Posts to count.
     * @example
     * // Count the number of Posts
     * const count = await prisma.post.count({
     *   where: {
     *     // ... the filter for the Posts we want to count
     *   }
     * })
    **/
    count<T extends PostCountArgs>(
      args?: Subset<T, PostCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PostCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Post.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PostAggregateArgs>(args: Subset<T, PostAggregateArgs>): Prisma.PrismaPromise<GetPostAggregateType<T>>

    /**
     * Group by Post.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PostGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PostGroupByArgs['orderBy'] }
        : { orderBy?: PostGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PostGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPostGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Post model
   */
  readonly fields: PostFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Post.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PostClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    author<T extends UserAccountDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserAccountDefaultArgs<ExtArgs>>): Prisma__UserAccountClient<$Result.GetResult<Prisma.$UserAccountPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    persona<T extends Post$personaArgs<ExtArgs> = {}>(args?: Subset<T, Post$personaArgs<ExtArgs>>): Prisma__PersonaClient<$Result.GetResult<Prisma.$PersonaPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    thread<T extends ThreadDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ThreadDefaultArgs<ExtArgs>>): Prisma__ThreadClient<$Result.GetResult<Prisma.$ThreadPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    parentPost<T extends Post$parentPostArgs<ExtArgs> = {}>(args?: Subset<T, Post$parentPostArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    repostOf<T extends Post$repostOfArgs<ExtArgs> = {}>(args?: Subset<T, Post$repostOfArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    newsItem<T extends Post$newsItemArgs<ExtArgs> = {}>(args?: Subset<T, Post$newsItemArgs<ExtArgs>>): Prisma__NewsItemClient<$Result.GetResult<Prisma.$NewsItemPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    replies<T extends Post$repliesArgs<ExtArgs> = {}>(args?: Subset<T, Post$repliesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findMany"> | Null>
    reposts<T extends Post$repostsArgs<ExtArgs> = {}>(args?: Subset<T, Post$repostsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findMany"> | Null>
    reactions<T extends Post$reactionsArgs<ExtArgs> = {}>(args?: Subset<T, Post$reactionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReactionPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Post model
   */ 
  interface PostFieldRefs {
    readonly id: FieldRef<"Post", 'String'>
    readonly authorId: FieldRef<"Post", 'String'>
    readonly personaId: FieldRef<"Post", 'String'>
    readonly content: FieldRef<"Post", 'String'>
    readonly mediaUrls: FieldRef<"Post", 'String[]'>
    readonly linkPreview: FieldRef<"Post", 'Json'>
    readonly threadId: FieldRef<"Post", 'String'>
    readonly parentPostId: FieldRef<"Post", 'String'>
    readonly repostOfId: FieldRef<"Post", 'String'>
    readonly isAIGenerated: FieldRef<"Post", 'Boolean'>
    readonly hashtags: FieldRef<"Post", 'String[]'>
    readonly mentions: FieldRef<"Post", 'String[]'>
    readonly newsItemId: FieldRef<"Post", 'String'>
    readonly newsContext: FieldRef<"Post", 'String'>
    readonly likeCount: FieldRef<"Post", 'Int'>
    readonly repostCount: FieldRef<"Post", 'Int'>
    readonly commentCount: FieldRef<"Post", 'Int'>
    readonly impressionCount: FieldRef<"Post", 'Int'>
    readonly contentWarning: FieldRef<"Post", 'String'>
    readonly isHidden: FieldRef<"Post", 'Boolean'>
    readonly reportCount: FieldRef<"Post", 'Int'>
    readonly publishedAt: FieldRef<"Post", 'DateTime'>
    readonly editedAt: FieldRef<"Post", 'DateTime'>
    readonly createdAt: FieldRef<"Post", 'DateTime'>
    readonly updatedAt: FieldRef<"Post", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Post findUnique
   */
  export type PostFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * Filter, which Post to fetch.
     */
    where: PostWhereUniqueInput
  }

  /**
   * Post findUniqueOrThrow
   */
  export type PostFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * Filter, which Post to fetch.
     */
    where: PostWhereUniqueInput
  }

  /**
   * Post findFirst
   */
  export type PostFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * Filter, which Post to fetch.
     */
    where?: PostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Posts to fetch.
     */
    orderBy?: PostOrderByWithRelationInput | PostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Posts.
     */
    cursor?: PostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Posts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Posts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Posts.
     */
    distinct?: PostScalarFieldEnum | PostScalarFieldEnum[]
  }

  /**
   * Post findFirstOrThrow
   */
  export type PostFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * Filter, which Post to fetch.
     */
    where?: PostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Posts to fetch.
     */
    orderBy?: PostOrderByWithRelationInput | PostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Posts.
     */
    cursor?: PostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Posts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Posts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Posts.
     */
    distinct?: PostScalarFieldEnum | PostScalarFieldEnum[]
  }

  /**
   * Post findMany
   */
  export type PostFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * Filter, which Posts to fetch.
     */
    where?: PostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Posts to fetch.
     */
    orderBy?: PostOrderByWithRelationInput | PostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Posts.
     */
    cursor?: PostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Posts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Posts.
     */
    skip?: number
    distinct?: PostScalarFieldEnum | PostScalarFieldEnum[]
  }

  /**
   * Post create
   */
  export type PostCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * The data needed to create a Post.
     */
    data: XOR<PostCreateInput, PostUncheckedCreateInput>
  }

  /**
   * Post createMany
   */
  export type PostCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Posts.
     */
    data: PostCreateManyInput | PostCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Post createManyAndReturn
   */
  export type PostCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Posts.
     */
    data: PostCreateManyInput | PostCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Post update
   */
  export type PostUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * The data needed to update a Post.
     */
    data: XOR<PostUpdateInput, PostUncheckedUpdateInput>
    /**
     * Choose, which Post to update.
     */
    where: PostWhereUniqueInput
  }

  /**
   * Post updateMany
   */
  export type PostUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Posts.
     */
    data: XOR<PostUpdateManyMutationInput, PostUncheckedUpdateManyInput>
    /**
     * Filter which Posts to update
     */
    where?: PostWhereInput
  }

  /**
   * Post upsert
   */
  export type PostUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * The filter to search for the Post to update in case it exists.
     */
    where: PostWhereUniqueInput
    /**
     * In case the Post found by the `where` argument doesn't exist, create a new Post with this data.
     */
    create: XOR<PostCreateInput, PostUncheckedCreateInput>
    /**
     * In case the Post was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PostUpdateInput, PostUncheckedUpdateInput>
  }

  /**
   * Post delete
   */
  export type PostDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * Filter which Post to delete.
     */
    where: PostWhereUniqueInput
  }

  /**
   * Post deleteMany
   */
  export type PostDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Posts to delete
     */
    where?: PostWhereInput
  }

  /**
   * Post.persona
   */
  export type Post$personaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Persona
     */
    select?: PersonaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersonaInclude<ExtArgs> | null
    where?: PersonaWhereInput
  }

  /**
   * Post.parentPost
   */
  export type Post$parentPostArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    where?: PostWhereInput
  }

  /**
   * Post.repostOf
   */
  export type Post$repostOfArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    where?: PostWhereInput
  }

  /**
   * Post.newsItem
   */
  export type Post$newsItemArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsItem
     */
    select?: NewsItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsItemInclude<ExtArgs> | null
    where?: NewsItemWhereInput
  }

  /**
   * Post.replies
   */
  export type Post$repliesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    where?: PostWhereInput
    orderBy?: PostOrderByWithRelationInput | PostOrderByWithRelationInput[]
    cursor?: PostWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PostScalarFieldEnum | PostScalarFieldEnum[]
  }

  /**
   * Post.reposts
   */
  export type Post$repostsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    where?: PostWhereInput
    orderBy?: PostOrderByWithRelationInput | PostOrderByWithRelationInput[]
    cursor?: PostWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PostScalarFieldEnum | PostScalarFieldEnum[]
  }

  /**
   * Post.reactions
   */
  export type Post$reactionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reaction
     */
    select?: ReactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReactionInclude<ExtArgs> | null
    where?: ReactionWhereInput
    orderBy?: ReactionOrderByWithRelationInput | ReactionOrderByWithRelationInput[]
    cursor?: ReactionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReactionScalarFieldEnum | ReactionScalarFieldEnum[]
  }

  /**
   * Post without action
   */
  export type PostDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
  }


  /**
   * Model Thread
   */

  export type AggregateThread = {
    _count: ThreadCountAggregateOutputType | null
    _avg: ThreadAvgAggregateOutputType | null
    _sum: ThreadSumAggregateOutputType | null
    _min: ThreadMinAggregateOutputType | null
    _max: ThreadMaxAggregateOutputType | null
  }

  export type ThreadAvgAggregateOutputType = {
    participantCount: number | null
    postCount: number | null
    maxDepth: number | null
    totalLikes: number | null
    totalReshares: number | null
  }

  export type ThreadSumAggregateOutputType = {
    participantCount: number | null
    postCount: number | null
    maxDepth: number | null
    totalLikes: number | null
    totalReshares: number | null
  }

  export type ThreadMinAggregateOutputType = {
    id: string | null
    originalPostId: string | null
    title: string | null
    participantCount: number | null
    postCount: number | null
    maxDepth: number | null
    totalLikes: number | null
    totalReshares: number | null
    lastActivityAt: Date | null
    isLocked: boolean | null
    isHidden: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ThreadMaxAggregateOutputType = {
    id: string | null
    originalPostId: string | null
    title: string | null
    participantCount: number | null
    postCount: number | null
    maxDepth: number | null
    totalLikes: number | null
    totalReshares: number | null
    lastActivityAt: Date | null
    isLocked: boolean | null
    isHidden: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ThreadCountAggregateOutputType = {
    id: number
    originalPostId: number
    title: number
    participantCount: number
    postCount: number
    maxDepth: number
    totalLikes: number
    totalReshares: number
    lastActivityAt: number
    isLocked: number
    isHidden: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ThreadAvgAggregateInputType = {
    participantCount?: true
    postCount?: true
    maxDepth?: true
    totalLikes?: true
    totalReshares?: true
  }

  export type ThreadSumAggregateInputType = {
    participantCount?: true
    postCount?: true
    maxDepth?: true
    totalLikes?: true
    totalReshares?: true
  }

  export type ThreadMinAggregateInputType = {
    id?: true
    originalPostId?: true
    title?: true
    participantCount?: true
    postCount?: true
    maxDepth?: true
    totalLikes?: true
    totalReshares?: true
    lastActivityAt?: true
    isLocked?: true
    isHidden?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ThreadMaxAggregateInputType = {
    id?: true
    originalPostId?: true
    title?: true
    participantCount?: true
    postCount?: true
    maxDepth?: true
    totalLikes?: true
    totalReshares?: true
    lastActivityAt?: true
    isLocked?: true
    isHidden?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ThreadCountAggregateInputType = {
    id?: true
    originalPostId?: true
    title?: true
    participantCount?: true
    postCount?: true
    maxDepth?: true
    totalLikes?: true
    totalReshares?: true
    lastActivityAt?: true
    isLocked?: true
    isHidden?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ThreadAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Thread to aggregate.
     */
    where?: ThreadWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Threads to fetch.
     */
    orderBy?: ThreadOrderByWithRelationInput | ThreadOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ThreadWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Threads from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Threads.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Threads
    **/
    _count?: true | ThreadCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ThreadAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ThreadSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ThreadMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ThreadMaxAggregateInputType
  }

  export type GetThreadAggregateType<T extends ThreadAggregateArgs> = {
        [P in keyof T & keyof AggregateThread]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateThread[P]>
      : GetScalarType<T[P], AggregateThread[P]>
  }




  export type ThreadGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ThreadWhereInput
    orderBy?: ThreadOrderByWithAggregationInput | ThreadOrderByWithAggregationInput[]
    by: ThreadScalarFieldEnum[] | ThreadScalarFieldEnum
    having?: ThreadScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ThreadCountAggregateInputType | true
    _avg?: ThreadAvgAggregateInputType
    _sum?: ThreadSumAggregateInputType
    _min?: ThreadMinAggregateInputType
    _max?: ThreadMaxAggregateInputType
  }

  export type ThreadGroupByOutputType = {
    id: string
    originalPostId: string
    title: string | null
    participantCount: number
    postCount: number
    maxDepth: number
    totalLikes: number
    totalReshares: number
    lastActivityAt: Date
    isLocked: boolean
    isHidden: boolean
    createdAt: Date
    updatedAt: Date
    _count: ThreadCountAggregateOutputType | null
    _avg: ThreadAvgAggregateOutputType | null
    _sum: ThreadSumAggregateOutputType | null
    _min: ThreadMinAggregateOutputType | null
    _max: ThreadMaxAggregateOutputType | null
  }

  type GetThreadGroupByPayload<T extends ThreadGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ThreadGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ThreadGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ThreadGroupByOutputType[P]>
            : GetScalarType<T[P], ThreadGroupByOutputType[P]>
        }
      >
    >


  export type ThreadSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    originalPostId?: boolean
    title?: boolean
    participantCount?: boolean
    postCount?: boolean
    maxDepth?: boolean
    totalLikes?: boolean
    totalReshares?: boolean
    lastActivityAt?: boolean
    isLocked?: boolean
    isHidden?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    posts?: boolean | Thread$postsArgs<ExtArgs>
    _count?: boolean | ThreadCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["thread"]>

  export type ThreadSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    originalPostId?: boolean
    title?: boolean
    participantCount?: boolean
    postCount?: boolean
    maxDepth?: boolean
    totalLikes?: boolean
    totalReshares?: boolean
    lastActivityAt?: boolean
    isLocked?: boolean
    isHidden?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["thread"]>

  export type ThreadSelectScalar = {
    id?: boolean
    originalPostId?: boolean
    title?: boolean
    participantCount?: boolean
    postCount?: boolean
    maxDepth?: boolean
    totalLikes?: boolean
    totalReshares?: boolean
    lastActivityAt?: boolean
    isLocked?: boolean
    isHidden?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ThreadInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    posts?: boolean | Thread$postsArgs<ExtArgs>
    _count?: boolean | ThreadCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ThreadIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ThreadPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Thread"
    objects: {
      posts: Prisma.$PostPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      originalPostId: string
      title: string | null
      participantCount: number
      postCount: number
      maxDepth: number
      totalLikes: number
      totalReshares: number
      lastActivityAt: Date
      isLocked: boolean
      isHidden: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["thread"]>
    composites: {}
  }

  type ThreadGetPayload<S extends boolean | null | undefined | ThreadDefaultArgs> = $Result.GetResult<Prisma.$ThreadPayload, S>

  type ThreadCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ThreadFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ThreadCountAggregateInputType | true
    }

  export interface ThreadDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Thread'], meta: { name: 'Thread' } }
    /**
     * Find zero or one Thread that matches the filter.
     * @param {ThreadFindUniqueArgs} args - Arguments to find a Thread
     * @example
     * // Get one Thread
     * const thread = await prisma.thread.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ThreadFindUniqueArgs>(args: SelectSubset<T, ThreadFindUniqueArgs<ExtArgs>>): Prisma__ThreadClient<$Result.GetResult<Prisma.$ThreadPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Thread that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ThreadFindUniqueOrThrowArgs} args - Arguments to find a Thread
     * @example
     * // Get one Thread
     * const thread = await prisma.thread.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ThreadFindUniqueOrThrowArgs>(args: SelectSubset<T, ThreadFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ThreadClient<$Result.GetResult<Prisma.$ThreadPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Thread that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ThreadFindFirstArgs} args - Arguments to find a Thread
     * @example
     * // Get one Thread
     * const thread = await prisma.thread.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ThreadFindFirstArgs>(args?: SelectSubset<T, ThreadFindFirstArgs<ExtArgs>>): Prisma__ThreadClient<$Result.GetResult<Prisma.$ThreadPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Thread that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ThreadFindFirstOrThrowArgs} args - Arguments to find a Thread
     * @example
     * // Get one Thread
     * const thread = await prisma.thread.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ThreadFindFirstOrThrowArgs>(args?: SelectSubset<T, ThreadFindFirstOrThrowArgs<ExtArgs>>): Prisma__ThreadClient<$Result.GetResult<Prisma.$ThreadPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Threads that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ThreadFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Threads
     * const threads = await prisma.thread.findMany()
     * 
     * // Get first 10 Threads
     * const threads = await prisma.thread.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const threadWithIdOnly = await prisma.thread.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ThreadFindManyArgs>(args?: SelectSubset<T, ThreadFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ThreadPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Thread.
     * @param {ThreadCreateArgs} args - Arguments to create a Thread.
     * @example
     * // Create one Thread
     * const Thread = await prisma.thread.create({
     *   data: {
     *     // ... data to create a Thread
     *   }
     * })
     * 
     */
    create<T extends ThreadCreateArgs>(args: SelectSubset<T, ThreadCreateArgs<ExtArgs>>): Prisma__ThreadClient<$Result.GetResult<Prisma.$ThreadPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Threads.
     * @param {ThreadCreateManyArgs} args - Arguments to create many Threads.
     * @example
     * // Create many Threads
     * const thread = await prisma.thread.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ThreadCreateManyArgs>(args?: SelectSubset<T, ThreadCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Threads and returns the data saved in the database.
     * @param {ThreadCreateManyAndReturnArgs} args - Arguments to create many Threads.
     * @example
     * // Create many Threads
     * const thread = await prisma.thread.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Threads and only return the `id`
     * const threadWithIdOnly = await prisma.thread.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ThreadCreateManyAndReturnArgs>(args?: SelectSubset<T, ThreadCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ThreadPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Thread.
     * @param {ThreadDeleteArgs} args - Arguments to delete one Thread.
     * @example
     * // Delete one Thread
     * const Thread = await prisma.thread.delete({
     *   where: {
     *     // ... filter to delete one Thread
     *   }
     * })
     * 
     */
    delete<T extends ThreadDeleteArgs>(args: SelectSubset<T, ThreadDeleteArgs<ExtArgs>>): Prisma__ThreadClient<$Result.GetResult<Prisma.$ThreadPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Thread.
     * @param {ThreadUpdateArgs} args - Arguments to update one Thread.
     * @example
     * // Update one Thread
     * const thread = await prisma.thread.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ThreadUpdateArgs>(args: SelectSubset<T, ThreadUpdateArgs<ExtArgs>>): Prisma__ThreadClient<$Result.GetResult<Prisma.$ThreadPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Threads.
     * @param {ThreadDeleteManyArgs} args - Arguments to filter Threads to delete.
     * @example
     * // Delete a few Threads
     * const { count } = await prisma.thread.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ThreadDeleteManyArgs>(args?: SelectSubset<T, ThreadDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Threads.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ThreadUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Threads
     * const thread = await prisma.thread.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ThreadUpdateManyArgs>(args: SelectSubset<T, ThreadUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Thread.
     * @param {ThreadUpsertArgs} args - Arguments to update or create a Thread.
     * @example
     * // Update or create a Thread
     * const thread = await prisma.thread.upsert({
     *   create: {
     *     // ... data to create a Thread
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Thread we want to update
     *   }
     * })
     */
    upsert<T extends ThreadUpsertArgs>(args: SelectSubset<T, ThreadUpsertArgs<ExtArgs>>): Prisma__ThreadClient<$Result.GetResult<Prisma.$ThreadPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Threads.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ThreadCountArgs} args - Arguments to filter Threads to count.
     * @example
     * // Count the number of Threads
     * const count = await prisma.thread.count({
     *   where: {
     *     // ... the filter for the Threads we want to count
     *   }
     * })
    **/
    count<T extends ThreadCountArgs>(
      args?: Subset<T, ThreadCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ThreadCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Thread.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ThreadAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ThreadAggregateArgs>(args: Subset<T, ThreadAggregateArgs>): Prisma.PrismaPromise<GetThreadAggregateType<T>>

    /**
     * Group by Thread.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ThreadGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ThreadGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ThreadGroupByArgs['orderBy'] }
        : { orderBy?: ThreadGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ThreadGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetThreadGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Thread model
   */
  readonly fields: ThreadFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Thread.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ThreadClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    posts<T extends Thread$postsArgs<ExtArgs> = {}>(args?: Subset<T, Thread$postsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Thread model
   */ 
  interface ThreadFieldRefs {
    readonly id: FieldRef<"Thread", 'String'>
    readonly originalPostId: FieldRef<"Thread", 'String'>
    readonly title: FieldRef<"Thread", 'String'>
    readonly participantCount: FieldRef<"Thread", 'Int'>
    readonly postCount: FieldRef<"Thread", 'Int'>
    readonly maxDepth: FieldRef<"Thread", 'Int'>
    readonly totalLikes: FieldRef<"Thread", 'Int'>
    readonly totalReshares: FieldRef<"Thread", 'Int'>
    readonly lastActivityAt: FieldRef<"Thread", 'DateTime'>
    readonly isLocked: FieldRef<"Thread", 'Boolean'>
    readonly isHidden: FieldRef<"Thread", 'Boolean'>
    readonly createdAt: FieldRef<"Thread", 'DateTime'>
    readonly updatedAt: FieldRef<"Thread", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Thread findUnique
   */
  export type ThreadFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Thread
     */
    select?: ThreadSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThreadInclude<ExtArgs> | null
    /**
     * Filter, which Thread to fetch.
     */
    where: ThreadWhereUniqueInput
  }

  /**
   * Thread findUniqueOrThrow
   */
  export type ThreadFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Thread
     */
    select?: ThreadSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThreadInclude<ExtArgs> | null
    /**
     * Filter, which Thread to fetch.
     */
    where: ThreadWhereUniqueInput
  }

  /**
   * Thread findFirst
   */
  export type ThreadFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Thread
     */
    select?: ThreadSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThreadInclude<ExtArgs> | null
    /**
     * Filter, which Thread to fetch.
     */
    where?: ThreadWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Threads to fetch.
     */
    orderBy?: ThreadOrderByWithRelationInput | ThreadOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Threads.
     */
    cursor?: ThreadWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Threads from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Threads.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Threads.
     */
    distinct?: ThreadScalarFieldEnum | ThreadScalarFieldEnum[]
  }

  /**
   * Thread findFirstOrThrow
   */
  export type ThreadFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Thread
     */
    select?: ThreadSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThreadInclude<ExtArgs> | null
    /**
     * Filter, which Thread to fetch.
     */
    where?: ThreadWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Threads to fetch.
     */
    orderBy?: ThreadOrderByWithRelationInput | ThreadOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Threads.
     */
    cursor?: ThreadWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Threads from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Threads.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Threads.
     */
    distinct?: ThreadScalarFieldEnum | ThreadScalarFieldEnum[]
  }

  /**
   * Thread findMany
   */
  export type ThreadFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Thread
     */
    select?: ThreadSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThreadInclude<ExtArgs> | null
    /**
     * Filter, which Threads to fetch.
     */
    where?: ThreadWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Threads to fetch.
     */
    orderBy?: ThreadOrderByWithRelationInput | ThreadOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Threads.
     */
    cursor?: ThreadWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Threads from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Threads.
     */
    skip?: number
    distinct?: ThreadScalarFieldEnum | ThreadScalarFieldEnum[]
  }

  /**
   * Thread create
   */
  export type ThreadCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Thread
     */
    select?: ThreadSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThreadInclude<ExtArgs> | null
    /**
     * The data needed to create a Thread.
     */
    data: XOR<ThreadCreateInput, ThreadUncheckedCreateInput>
  }

  /**
   * Thread createMany
   */
  export type ThreadCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Threads.
     */
    data: ThreadCreateManyInput | ThreadCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Thread createManyAndReturn
   */
  export type ThreadCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Thread
     */
    select?: ThreadSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Threads.
     */
    data: ThreadCreateManyInput | ThreadCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Thread update
   */
  export type ThreadUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Thread
     */
    select?: ThreadSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThreadInclude<ExtArgs> | null
    /**
     * The data needed to update a Thread.
     */
    data: XOR<ThreadUpdateInput, ThreadUncheckedUpdateInput>
    /**
     * Choose, which Thread to update.
     */
    where: ThreadWhereUniqueInput
  }

  /**
   * Thread updateMany
   */
  export type ThreadUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Threads.
     */
    data: XOR<ThreadUpdateManyMutationInput, ThreadUncheckedUpdateManyInput>
    /**
     * Filter which Threads to update
     */
    where?: ThreadWhereInput
  }

  /**
   * Thread upsert
   */
  export type ThreadUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Thread
     */
    select?: ThreadSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThreadInclude<ExtArgs> | null
    /**
     * The filter to search for the Thread to update in case it exists.
     */
    where: ThreadWhereUniqueInput
    /**
     * In case the Thread found by the `where` argument doesn't exist, create a new Thread with this data.
     */
    create: XOR<ThreadCreateInput, ThreadUncheckedCreateInput>
    /**
     * In case the Thread was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ThreadUpdateInput, ThreadUncheckedUpdateInput>
  }

  /**
   * Thread delete
   */
  export type ThreadDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Thread
     */
    select?: ThreadSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThreadInclude<ExtArgs> | null
    /**
     * Filter which Thread to delete.
     */
    where: ThreadWhereUniqueInput
  }

  /**
   * Thread deleteMany
   */
  export type ThreadDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Threads to delete
     */
    where?: ThreadWhereInput
  }

  /**
   * Thread.posts
   */
  export type Thread$postsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    where?: PostWhereInput
    orderBy?: PostOrderByWithRelationInput | PostOrderByWithRelationInput[]
    cursor?: PostWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PostScalarFieldEnum | PostScalarFieldEnum[]
  }

  /**
   * Thread without action
   */
  export type ThreadDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Thread
     */
    select?: ThreadSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThreadInclude<ExtArgs> | null
  }


  /**
   * Model Reaction
   */

  export type AggregateReaction = {
    _count: ReactionCountAggregateOutputType | null
    _min: ReactionMinAggregateOutputType | null
    _max: ReactionMaxAggregateOutputType | null
  }

  export type ReactionMinAggregateOutputType = {
    id: string | null
    userId: string | null
    postId: string | null
    type: $Enums.ReactionType | null
    createdAt: Date | null
  }

  export type ReactionMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    postId: string | null
    type: $Enums.ReactionType | null
    createdAt: Date | null
  }

  export type ReactionCountAggregateOutputType = {
    id: number
    userId: number
    postId: number
    type: number
    createdAt: number
    _all: number
  }


  export type ReactionMinAggregateInputType = {
    id?: true
    userId?: true
    postId?: true
    type?: true
    createdAt?: true
  }

  export type ReactionMaxAggregateInputType = {
    id?: true
    userId?: true
    postId?: true
    type?: true
    createdAt?: true
  }

  export type ReactionCountAggregateInputType = {
    id?: true
    userId?: true
    postId?: true
    type?: true
    createdAt?: true
    _all?: true
  }

  export type ReactionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Reaction to aggregate.
     */
    where?: ReactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reactions to fetch.
     */
    orderBy?: ReactionOrderByWithRelationInput | ReactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ReactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Reactions
    **/
    _count?: true | ReactionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ReactionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ReactionMaxAggregateInputType
  }

  export type GetReactionAggregateType<T extends ReactionAggregateArgs> = {
        [P in keyof T & keyof AggregateReaction]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateReaction[P]>
      : GetScalarType<T[P], AggregateReaction[P]>
  }




  export type ReactionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReactionWhereInput
    orderBy?: ReactionOrderByWithAggregationInput | ReactionOrderByWithAggregationInput[]
    by: ReactionScalarFieldEnum[] | ReactionScalarFieldEnum
    having?: ReactionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ReactionCountAggregateInputType | true
    _min?: ReactionMinAggregateInputType
    _max?: ReactionMaxAggregateInputType
  }

  export type ReactionGroupByOutputType = {
    id: string
    userId: string
    postId: string
    type: $Enums.ReactionType
    createdAt: Date
    _count: ReactionCountAggregateOutputType | null
    _min: ReactionMinAggregateOutputType | null
    _max: ReactionMaxAggregateOutputType | null
  }

  type GetReactionGroupByPayload<T extends ReactionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ReactionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ReactionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ReactionGroupByOutputType[P]>
            : GetScalarType<T[P], ReactionGroupByOutputType[P]>
        }
      >
    >


  export type ReactionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    postId?: boolean
    type?: boolean
    createdAt?: boolean
    user?: boolean | UserAccountDefaultArgs<ExtArgs>
    post?: boolean | PostDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["reaction"]>

  export type ReactionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    postId?: boolean
    type?: boolean
    createdAt?: boolean
    user?: boolean | UserAccountDefaultArgs<ExtArgs>
    post?: boolean | PostDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["reaction"]>

  export type ReactionSelectScalar = {
    id?: boolean
    userId?: boolean
    postId?: boolean
    type?: boolean
    createdAt?: boolean
  }

  export type ReactionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserAccountDefaultArgs<ExtArgs>
    post?: boolean | PostDefaultArgs<ExtArgs>
  }
  export type ReactionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserAccountDefaultArgs<ExtArgs>
    post?: boolean | PostDefaultArgs<ExtArgs>
  }

  export type $ReactionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Reaction"
    objects: {
      user: Prisma.$UserAccountPayload<ExtArgs>
      post: Prisma.$PostPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      postId: string
      type: $Enums.ReactionType
      createdAt: Date
    }, ExtArgs["result"]["reaction"]>
    composites: {}
  }

  type ReactionGetPayload<S extends boolean | null | undefined | ReactionDefaultArgs> = $Result.GetResult<Prisma.$ReactionPayload, S>

  type ReactionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ReactionFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ReactionCountAggregateInputType | true
    }

  export interface ReactionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Reaction'], meta: { name: 'Reaction' } }
    /**
     * Find zero or one Reaction that matches the filter.
     * @param {ReactionFindUniqueArgs} args - Arguments to find a Reaction
     * @example
     * // Get one Reaction
     * const reaction = await prisma.reaction.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ReactionFindUniqueArgs>(args: SelectSubset<T, ReactionFindUniqueArgs<ExtArgs>>): Prisma__ReactionClient<$Result.GetResult<Prisma.$ReactionPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Reaction that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ReactionFindUniqueOrThrowArgs} args - Arguments to find a Reaction
     * @example
     * // Get one Reaction
     * const reaction = await prisma.reaction.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ReactionFindUniqueOrThrowArgs>(args: SelectSubset<T, ReactionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ReactionClient<$Result.GetResult<Prisma.$ReactionPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Reaction that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReactionFindFirstArgs} args - Arguments to find a Reaction
     * @example
     * // Get one Reaction
     * const reaction = await prisma.reaction.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ReactionFindFirstArgs>(args?: SelectSubset<T, ReactionFindFirstArgs<ExtArgs>>): Prisma__ReactionClient<$Result.GetResult<Prisma.$ReactionPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Reaction that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReactionFindFirstOrThrowArgs} args - Arguments to find a Reaction
     * @example
     * // Get one Reaction
     * const reaction = await prisma.reaction.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ReactionFindFirstOrThrowArgs>(args?: SelectSubset<T, ReactionFindFirstOrThrowArgs<ExtArgs>>): Prisma__ReactionClient<$Result.GetResult<Prisma.$ReactionPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Reactions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReactionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Reactions
     * const reactions = await prisma.reaction.findMany()
     * 
     * // Get first 10 Reactions
     * const reactions = await prisma.reaction.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const reactionWithIdOnly = await prisma.reaction.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ReactionFindManyArgs>(args?: SelectSubset<T, ReactionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReactionPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Reaction.
     * @param {ReactionCreateArgs} args - Arguments to create a Reaction.
     * @example
     * // Create one Reaction
     * const Reaction = await prisma.reaction.create({
     *   data: {
     *     // ... data to create a Reaction
     *   }
     * })
     * 
     */
    create<T extends ReactionCreateArgs>(args: SelectSubset<T, ReactionCreateArgs<ExtArgs>>): Prisma__ReactionClient<$Result.GetResult<Prisma.$ReactionPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Reactions.
     * @param {ReactionCreateManyArgs} args - Arguments to create many Reactions.
     * @example
     * // Create many Reactions
     * const reaction = await prisma.reaction.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ReactionCreateManyArgs>(args?: SelectSubset<T, ReactionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Reactions and returns the data saved in the database.
     * @param {ReactionCreateManyAndReturnArgs} args - Arguments to create many Reactions.
     * @example
     * // Create many Reactions
     * const reaction = await prisma.reaction.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Reactions and only return the `id`
     * const reactionWithIdOnly = await prisma.reaction.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ReactionCreateManyAndReturnArgs>(args?: SelectSubset<T, ReactionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReactionPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Reaction.
     * @param {ReactionDeleteArgs} args - Arguments to delete one Reaction.
     * @example
     * // Delete one Reaction
     * const Reaction = await prisma.reaction.delete({
     *   where: {
     *     // ... filter to delete one Reaction
     *   }
     * })
     * 
     */
    delete<T extends ReactionDeleteArgs>(args: SelectSubset<T, ReactionDeleteArgs<ExtArgs>>): Prisma__ReactionClient<$Result.GetResult<Prisma.$ReactionPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Reaction.
     * @param {ReactionUpdateArgs} args - Arguments to update one Reaction.
     * @example
     * // Update one Reaction
     * const reaction = await prisma.reaction.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ReactionUpdateArgs>(args: SelectSubset<T, ReactionUpdateArgs<ExtArgs>>): Prisma__ReactionClient<$Result.GetResult<Prisma.$ReactionPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Reactions.
     * @param {ReactionDeleteManyArgs} args - Arguments to filter Reactions to delete.
     * @example
     * // Delete a few Reactions
     * const { count } = await prisma.reaction.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ReactionDeleteManyArgs>(args?: SelectSubset<T, ReactionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Reactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReactionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Reactions
     * const reaction = await prisma.reaction.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ReactionUpdateManyArgs>(args: SelectSubset<T, ReactionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Reaction.
     * @param {ReactionUpsertArgs} args - Arguments to update or create a Reaction.
     * @example
     * // Update or create a Reaction
     * const reaction = await prisma.reaction.upsert({
     *   create: {
     *     // ... data to create a Reaction
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Reaction we want to update
     *   }
     * })
     */
    upsert<T extends ReactionUpsertArgs>(args: SelectSubset<T, ReactionUpsertArgs<ExtArgs>>): Prisma__ReactionClient<$Result.GetResult<Prisma.$ReactionPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Reactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReactionCountArgs} args - Arguments to filter Reactions to count.
     * @example
     * // Count the number of Reactions
     * const count = await prisma.reaction.count({
     *   where: {
     *     // ... the filter for the Reactions we want to count
     *   }
     * })
    **/
    count<T extends ReactionCountArgs>(
      args?: Subset<T, ReactionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ReactionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Reaction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReactionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ReactionAggregateArgs>(args: Subset<T, ReactionAggregateArgs>): Prisma.PrismaPromise<GetReactionAggregateType<T>>

    /**
     * Group by Reaction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReactionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ReactionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ReactionGroupByArgs['orderBy'] }
        : { orderBy?: ReactionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ReactionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReactionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Reaction model
   */
  readonly fields: ReactionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Reaction.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ReactionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserAccountDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserAccountDefaultArgs<ExtArgs>>): Prisma__UserAccountClient<$Result.GetResult<Prisma.$UserAccountPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    post<T extends PostDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PostDefaultArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Reaction model
   */ 
  interface ReactionFieldRefs {
    readonly id: FieldRef<"Reaction", 'String'>
    readonly userId: FieldRef<"Reaction", 'String'>
    readonly postId: FieldRef<"Reaction", 'String'>
    readonly type: FieldRef<"Reaction", 'ReactionType'>
    readonly createdAt: FieldRef<"Reaction", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Reaction findUnique
   */
  export type ReactionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reaction
     */
    select?: ReactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReactionInclude<ExtArgs> | null
    /**
     * Filter, which Reaction to fetch.
     */
    where: ReactionWhereUniqueInput
  }

  /**
   * Reaction findUniqueOrThrow
   */
  export type ReactionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reaction
     */
    select?: ReactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReactionInclude<ExtArgs> | null
    /**
     * Filter, which Reaction to fetch.
     */
    where: ReactionWhereUniqueInput
  }

  /**
   * Reaction findFirst
   */
  export type ReactionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reaction
     */
    select?: ReactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReactionInclude<ExtArgs> | null
    /**
     * Filter, which Reaction to fetch.
     */
    where?: ReactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reactions to fetch.
     */
    orderBy?: ReactionOrderByWithRelationInput | ReactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Reactions.
     */
    cursor?: ReactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Reactions.
     */
    distinct?: ReactionScalarFieldEnum | ReactionScalarFieldEnum[]
  }

  /**
   * Reaction findFirstOrThrow
   */
  export type ReactionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reaction
     */
    select?: ReactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReactionInclude<ExtArgs> | null
    /**
     * Filter, which Reaction to fetch.
     */
    where?: ReactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reactions to fetch.
     */
    orderBy?: ReactionOrderByWithRelationInput | ReactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Reactions.
     */
    cursor?: ReactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Reactions.
     */
    distinct?: ReactionScalarFieldEnum | ReactionScalarFieldEnum[]
  }

  /**
   * Reaction findMany
   */
  export type ReactionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reaction
     */
    select?: ReactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReactionInclude<ExtArgs> | null
    /**
     * Filter, which Reactions to fetch.
     */
    where?: ReactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reactions to fetch.
     */
    orderBy?: ReactionOrderByWithRelationInput | ReactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Reactions.
     */
    cursor?: ReactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reactions.
     */
    skip?: number
    distinct?: ReactionScalarFieldEnum | ReactionScalarFieldEnum[]
  }

  /**
   * Reaction create
   */
  export type ReactionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reaction
     */
    select?: ReactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReactionInclude<ExtArgs> | null
    /**
     * The data needed to create a Reaction.
     */
    data: XOR<ReactionCreateInput, ReactionUncheckedCreateInput>
  }

  /**
   * Reaction createMany
   */
  export type ReactionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Reactions.
     */
    data: ReactionCreateManyInput | ReactionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Reaction createManyAndReturn
   */
  export type ReactionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reaction
     */
    select?: ReactionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Reactions.
     */
    data: ReactionCreateManyInput | ReactionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReactionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Reaction update
   */
  export type ReactionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reaction
     */
    select?: ReactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReactionInclude<ExtArgs> | null
    /**
     * The data needed to update a Reaction.
     */
    data: XOR<ReactionUpdateInput, ReactionUncheckedUpdateInput>
    /**
     * Choose, which Reaction to update.
     */
    where: ReactionWhereUniqueInput
  }

  /**
   * Reaction updateMany
   */
  export type ReactionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Reactions.
     */
    data: XOR<ReactionUpdateManyMutationInput, ReactionUncheckedUpdateManyInput>
    /**
     * Filter which Reactions to update
     */
    where?: ReactionWhereInput
  }

  /**
   * Reaction upsert
   */
  export type ReactionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reaction
     */
    select?: ReactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReactionInclude<ExtArgs> | null
    /**
     * The filter to search for the Reaction to update in case it exists.
     */
    where: ReactionWhereUniqueInput
    /**
     * In case the Reaction found by the `where` argument doesn't exist, create a new Reaction with this data.
     */
    create: XOR<ReactionCreateInput, ReactionUncheckedCreateInput>
    /**
     * In case the Reaction was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ReactionUpdateInput, ReactionUncheckedUpdateInput>
  }

  /**
   * Reaction delete
   */
  export type ReactionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reaction
     */
    select?: ReactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReactionInclude<ExtArgs> | null
    /**
     * Filter which Reaction to delete.
     */
    where: ReactionWhereUniqueInput
  }

  /**
   * Reaction deleteMany
   */
  export type ReactionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Reactions to delete
     */
    where?: ReactionWhereInput
  }

  /**
   * Reaction without action
   */
  export type ReactionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reaction
     */
    select?: ReactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReactionInclude<ExtArgs> | null
  }


  /**
   * Model Persona
   */

  export type AggregatePersona = {
    _count: PersonaCountAggregateOutputType | null
    _avg: PersonaAvgAggregateOutputType | null
    _sum: PersonaSumAggregateOutputType | null
    _min: PersonaMinAggregateOutputType | null
    _max: PersonaMaxAggregateOutputType | null
  }

  export type PersonaAvgAggregateOutputType = {
    controversyTolerance: number | null
    engagementFrequency: number | null
    debateAggression: number | null
    contextWindow: number | null
  }

  export type PersonaSumAggregateOutputType = {
    controversyTolerance: number | null
    engagementFrequency: number | null
    debateAggression: number | null
    contextWindow: number | null
  }

  export type PersonaMinAggregateOutputType = {
    id: string | null
    name: string | null
    handle: string | null
    bio: string | null
    profileImageUrl: string | null
    personaType: $Enums.PersonaType | null
    toneStyle: $Enums.ToneStyle | null
    controversyTolerance: number | null
    engagementFrequency: number | null
    debateAggression: number | null
    politicalAlignmentId: string | null
    aiProvider: string | null
    systemPrompt: string | null
    contextWindow: number | null
    timezonePreference: string | null
    isActive: boolean | null
    isDefault: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PersonaMaxAggregateOutputType = {
    id: string | null
    name: string | null
    handle: string | null
    bio: string | null
    profileImageUrl: string | null
    personaType: $Enums.PersonaType | null
    toneStyle: $Enums.ToneStyle | null
    controversyTolerance: number | null
    engagementFrequency: number | null
    debateAggression: number | null
    politicalAlignmentId: string | null
    aiProvider: string | null
    systemPrompt: string | null
    contextWindow: number | null
    timezonePreference: string | null
    isActive: boolean | null
    isDefault: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PersonaCountAggregateOutputType = {
    id: number
    name: number
    handle: number
    bio: number
    profileImageUrl: number
    personaType: number
    personalityTraits: number
    interests: number
    expertise: number
    toneStyle: number
    controversyTolerance: number
    engagementFrequency: number
    debateAggression: number
    politicalAlignmentId: number
    aiProvider: number
    systemPrompt: number
    contextWindow: number
    postingSchedule: number
    timezonePreference: number
    isActive: number
    isDefault: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PersonaAvgAggregateInputType = {
    controversyTolerance?: true
    engagementFrequency?: true
    debateAggression?: true
    contextWindow?: true
  }

  export type PersonaSumAggregateInputType = {
    controversyTolerance?: true
    engagementFrequency?: true
    debateAggression?: true
    contextWindow?: true
  }

  export type PersonaMinAggregateInputType = {
    id?: true
    name?: true
    handle?: true
    bio?: true
    profileImageUrl?: true
    personaType?: true
    toneStyle?: true
    controversyTolerance?: true
    engagementFrequency?: true
    debateAggression?: true
    politicalAlignmentId?: true
    aiProvider?: true
    systemPrompt?: true
    contextWindow?: true
    timezonePreference?: true
    isActive?: true
    isDefault?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PersonaMaxAggregateInputType = {
    id?: true
    name?: true
    handle?: true
    bio?: true
    profileImageUrl?: true
    personaType?: true
    toneStyle?: true
    controversyTolerance?: true
    engagementFrequency?: true
    debateAggression?: true
    politicalAlignmentId?: true
    aiProvider?: true
    systemPrompt?: true
    contextWindow?: true
    timezonePreference?: true
    isActive?: true
    isDefault?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PersonaCountAggregateInputType = {
    id?: true
    name?: true
    handle?: true
    bio?: true
    profileImageUrl?: true
    personaType?: true
    personalityTraits?: true
    interests?: true
    expertise?: true
    toneStyle?: true
    controversyTolerance?: true
    engagementFrequency?: true
    debateAggression?: true
    politicalAlignmentId?: true
    aiProvider?: true
    systemPrompt?: true
    contextWindow?: true
    postingSchedule?: true
    timezonePreference?: true
    isActive?: true
    isDefault?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PersonaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Persona to aggregate.
     */
    where?: PersonaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Personas to fetch.
     */
    orderBy?: PersonaOrderByWithRelationInput | PersonaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PersonaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Personas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Personas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Personas
    **/
    _count?: true | PersonaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PersonaAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PersonaSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PersonaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PersonaMaxAggregateInputType
  }

  export type GetPersonaAggregateType<T extends PersonaAggregateArgs> = {
        [P in keyof T & keyof AggregatePersona]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePersona[P]>
      : GetScalarType<T[P], AggregatePersona[P]>
  }




  export type PersonaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PersonaWhereInput
    orderBy?: PersonaOrderByWithAggregationInput | PersonaOrderByWithAggregationInput[]
    by: PersonaScalarFieldEnum[] | PersonaScalarFieldEnum
    having?: PersonaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PersonaCountAggregateInputType | true
    _avg?: PersonaAvgAggregateInputType
    _sum?: PersonaSumAggregateInputType
    _min?: PersonaMinAggregateInputType
    _max?: PersonaMaxAggregateInputType
  }

  export type PersonaGroupByOutputType = {
    id: string
    name: string
    handle: string
    bio: string
    profileImageUrl: string
    personaType: $Enums.PersonaType
    personalityTraits: string[]
    interests: string[]
    expertise: string[]
    toneStyle: $Enums.ToneStyle
    controversyTolerance: number
    engagementFrequency: number
    debateAggression: number
    politicalAlignmentId: string
    aiProvider: string
    systemPrompt: string
    contextWindow: number
    postingSchedule: JsonValue
    timezonePreference: string
    isActive: boolean
    isDefault: boolean
    createdAt: Date
    updatedAt: Date
    _count: PersonaCountAggregateOutputType | null
    _avg: PersonaAvgAggregateOutputType | null
    _sum: PersonaSumAggregateOutputType | null
    _min: PersonaMinAggregateOutputType | null
    _max: PersonaMaxAggregateOutputType | null
  }

  type GetPersonaGroupByPayload<T extends PersonaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PersonaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PersonaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PersonaGroupByOutputType[P]>
            : GetScalarType<T[P], PersonaGroupByOutputType[P]>
        }
      >
    >


  export type PersonaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    handle?: boolean
    bio?: boolean
    profileImageUrl?: boolean
    personaType?: boolean
    personalityTraits?: boolean
    interests?: boolean
    expertise?: boolean
    toneStyle?: boolean
    controversyTolerance?: boolean
    engagementFrequency?: boolean
    debateAggression?: boolean
    politicalAlignmentId?: boolean
    aiProvider?: boolean
    systemPrompt?: boolean
    contextWindow?: boolean
    postingSchedule?: boolean
    timezonePreference?: boolean
    isActive?: boolean
    isDefault?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    politicalAlignment?: boolean | PoliticalAlignmentDefaultArgs<ExtArgs>
    posts?: boolean | Persona$postsArgs<ExtArgs>
    _count?: boolean | PersonaCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["persona"]>

  export type PersonaSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    handle?: boolean
    bio?: boolean
    profileImageUrl?: boolean
    personaType?: boolean
    personalityTraits?: boolean
    interests?: boolean
    expertise?: boolean
    toneStyle?: boolean
    controversyTolerance?: boolean
    engagementFrequency?: boolean
    debateAggression?: boolean
    politicalAlignmentId?: boolean
    aiProvider?: boolean
    systemPrompt?: boolean
    contextWindow?: boolean
    postingSchedule?: boolean
    timezonePreference?: boolean
    isActive?: boolean
    isDefault?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    politicalAlignment?: boolean | PoliticalAlignmentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["persona"]>

  export type PersonaSelectScalar = {
    id?: boolean
    name?: boolean
    handle?: boolean
    bio?: boolean
    profileImageUrl?: boolean
    personaType?: boolean
    personalityTraits?: boolean
    interests?: boolean
    expertise?: boolean
    toneStyle?: boolean
    controversyTolerance?: boolean
    engagementFrequency?: boolean
    debateAggression?: boolean
    politicalAlignmentId?: boolean
    aiProvider?: boolean
    systemPrompt?: boolean
    contextWindow?: boolean
    postingSchedule?: boolean
    timezonePreference?: boolean
    isActive?: boolean
    isDefault?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PersonaInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    politicalAlignment?: boolean | PoliticalAlignmentDefaultArgs<ExtArgs>
    posts?: boolean | Persona$postsArgs<ExtArgs>
    _count?: boolean | PersonaCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PersonaIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    politicalAlignment?: boolean | PoliticalAlignmentDefaultArgs<ExtArgs>
  }

  export type $PersonaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Persona"
    objects: {
      politicalAlignment: Prisma.$PoliticalAlignmentPayload<ExtArgs>
      posts: Prisma.$PostPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      handle: string
      bio: string
      profileImageUrl: string
      personaType: $Enums.PersonaType
      personalityTraits: string[]
      interests: string[]
      expertise: string[]
      toneStyle: $Enums.ToneStyle
      controversyTolerance: number
      engagementFrequency: number
      debateAggression: number
      politicalAlignmentId: string
      aiProvider: string
      systemPrompt: string
      contextWindow: number
      postingSchedule: Prisma.JsonValue
      timezonePreference: string
      isActive: boolean
      isDefault: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["persona"]>
    composites: {}
  }

  type PersonaGetPayload<S extends boolean | null | undefined | PersonaDefaultArgs> = $Result.GetResult<Prisma.$PersonaPayload, S>

  type PersonaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PersonaFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PersonaCountAggregateInputType | true
    }

  export interface PersonaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Persona'], meta: { name: 'Persona' } }
    /**
     * Find zero or one Persona that matches the filter.
     * @param {PersonaFindUniqueArgs} args - Arguments to find a Persona
     * @example
     * // Get one Persona
     * const persona = await prisma.persona.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PersonaFindUniqueArgs>(args: SelectSubset<T, PersonaFindUniqueArgs<ExtArgs>>): Prisma__PersonaClient<$Result.GetResult<Prisma.$PersonaPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Persona that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PersonaFindUniqueOrThrowArgs} args - Arguments to find a Persona
     * @example
     * // Get one Persona
     * const persona = await prisma.persona.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PersonaFindUniqueOrThrowArgs>(args: SelectSubset<T, PersonaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PersonaClient<$Result.GetResult<Prisma.$PersonaPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Persona that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PersonaFindFirstArgs} args - Arguments to find a Persona
     * @example
     * // Get one Persona
     * const persona = await prisma.persona.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PersonaFindFirstArgs>(args?: SelectSubset<T, PersonaFindFirstArgs<ExtArgs>>): Prisma__PersonaClient<$Result.GetResult<Prisma.$PersonaPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Persona that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PersonaFindFirstOrThrowArgs} args - Arguments to find a Persona
     * @example
     * // Get one Persona
     * const persona = await prisma.persona.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PersonaFindFirstOrThrowArgs>(args?: SelectSubset<T, PersonaFindFirstOrThrowArgs<ExtArgs>>): Prisma__PersonaClient<$Result.GetResult<Prisma.$PersonaPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Personas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PersonaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Personas
     * const personas = await prisma.persona.findMany()
     * 
     * // Get first 10 Personas
     * const personas = await prisma.persona.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const personaWithIdOnly = await prisma.persona.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PersonaFindManyArgs>(args?: SelectSubset<T, PersonaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PersonaPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Persona.
     * @param {PersonaCreateArgs} args - Arguments to create a Persona.
     * @example
     * // Create one Persona
     * const Persona = await prisma.persona.create({
     *   data: {
     *     // ... data to create a Persona
     *   }
     * })
     * 
     */
    create<T extends PersonaCreateArgs>(args: SelectSubset<T, PersonaCreateArgs<ExtArgs>>): Prisma__PersonaClient<$Result.GetResult<Prisma.$PersonaPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Personas.
     * @param {PersonaCreateManyArgs} args - Arguments to create many Personas.
     * @example
     * // Create many Personas
     * const persona = await prisma.persona.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PersonaCreateManyArgs>(args?: SelectSubset<T, PersonaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Personas and returns the data saved in the database.
     * @param {PersonaCreateManyAndReturnArgs} args - Arguments to create many Personas.
     * @example
     * // Create many Personas
     * const persona = await prisma.persona.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Personas and only return the `id`
     * const personaWithIdOnly = await prisma.persona.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PersonaCreateManyAndReturnArgs>(args?: SelectSubset<T, PersonaCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PersonaPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Persona.
     * @param {PersonaDeleteArgs} args - Arguments to delete one Persona.
     * @example
     * // Delete one Persona
     * const Persona = await prisma.persona.delete({
     *   where: {
     *     // ... filter to delete one Persona
     *   }
     * })
     * 
     */
    delete<T extends PersonaDeleteArgs>(args: SelectSubset<T, PersonaDeleteArgs<ExtArgs>>): Prisma__PersonaClient<$Result.GetResult<Prisma.$PersonaPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Persona.
     * @param {PersonaUpdateArgs} args - Arguments to update one Persona.
     * @example
     * // Update one Persona
     * const persona = await prisma.persona.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PersonaUpdateArgs>(args: SelectSubset<T, PersonaUpdateArgs<ExtArgs>>): Prisma__PersonaClient<$Result.GetResult<Prisma.$PersonaPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Personas.
     * @param {PersonaDeleteManyArgs} args - Arguments to filter Personas to delete.
     * @example
     * // Delete a few Personas
     * const { count } = await prisma.persona.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PersonaDeleteManyArgs>(args?: SelectSubset<T, PersonaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Personas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PersonaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Personas
     * const persona = await prisma.persona.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PersonaUpdateManyArgs>(args: SelectSubset<T, PersonaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Persona.
     * @param {PersonaUpsertArgs} args - Arguments to update or create a Persona.
     * @example
     * // Update or create a Persona
     * const persona = await prisma.persona.upsert({
     *   create: {
     *     // ... data to create a Persona
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Persona we want to update
     *   }
     * })
     */
    upsert<T extends PersonaUpsertArgs>(args: SelectSubset<T, PersonaUpsertArgs<ExtArgs>>): Prisma__PersonaClient<$Result.GetResult<Prisma.$PersonaPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Personas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PersonaCountArgs} args - Arguments to filter Personas to count.
     * @example
     * // Count the number of Personas
     * const count = await prisma.persona.count({
     *   where: {
     *     // ... the filter for the Personas we want to count
     *   }
     * })
    **/
    count<T extends PersonaCountArgs>(
      args?: Subset<T, PersonaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PersonaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Persona.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PersonaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PersonaAggregateArgs>(args: Subset<T, PersonaAggregateArgs>): Prisma.PrismaPromise<GetPersonaAggregateType<T>>

    /**
     * Group by Persona.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PersonaGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PersonaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PersonaGroupByArgs['orderBy'] }
        : { orderBy?: PersonaGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PersonaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPersonaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Persona model
   */
  readonly fields: PersonaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Persona.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PersonaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    politicalAlignment<T extends PoliticalAlignmentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PoliticalAlignmentDefaultArgs<ExtArgs>>): Prisma__PoliticalAlignmentClient<$Result.GetResult<Prisma.$PoliticalAlignmentPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    posts<T extends Persona$postsArgs<ExtArgs> = {}>(args?: Subset<T, Persona$postsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Persona model
   */ 
  interface PersonaFieldRefs {
    readonly id: FieldRef<"Persona", 'String'>
    readonly name: FieldRef<"Persona", 'String'>
    readonly handle: FieldRef<"Persona", 'String'>
    readonly bio: FieldRef<"Persona", 'String'>
    readonly profileImageUrl: FieldRef<"Persona", 'String'>
    readonly personaType: FieldRef<"Persona", 'PersonaType'>
    readonly personalityTraits: FieldRef<"Persona", 'String[]'>
    readonly interests: FieldRef<"Persona", 'String[]'>
    readonly expertise: FieldRef<"Persona", 'String[]'>
    readonly toneStyle: FieldRef<"Persona", 'ToneStyle'>
    readonly controversyTolerance: FieldRef<"Persona", 'Int'>
    readonly engagementFrequency: FieldRef<"Persona", 'Int'>
    readonly debateAggression: FieldRef<"Persona", 'Int'>
    readonly politicalAlignmentId: FieldRef<"Persona", 'String'>
    readonly aiProvider: FieldRef<"Persona", 'String'>
    readonly systemPrompt: FieldRef<"Persona", 'String'>
    readonly contextWindow: FieldRef<"Persona", 'Int'>
    readonly postingSchedule: FieldRef<"Persona", 'Json'>
    readonly timezonePreference: FieldRef<"Persona", 'String'>
    readonly isActive: FieldRef<"Persona", 'Boolean'>
    readonly isDefault: FieldRef<"Persona", 'Boolean'>
    readonly createdAt: FieldRef<"Persona", 'DateTime'>
    readonly updatedAt: FieldRef<"Persona", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Persona findUnique
   */
  export type PersonaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Persona
     */
    select?: PersonaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersonaInclude<ExtArgs> | null
    /**
     * Filter, which Persona to fetch.
     */
    where: PersonaWhereUniqueInput
  }

  /**
   * Persona findUniqueOrThrow
   */
  export type PersonaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Persona
     */
    select?: PersonaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersonaInclude<ExtArgs> | null
    /**
     * Filter, which Persona to fetch.
     */
    where: PersonaWhereUniqueInput
  }

  /**
   * Persona findFirst
   */
  export type PersonaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Persona
     */
    select?: PersonaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersonaInclude<ExtArgs> | null
    /**
     * Filter, which Persona to fetch.
     */
    where?: PersonaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Personas to fetch.
     */
    orderBy?: PersonaOrderByWithRelationInput | PersonaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Personas.
     */
    cursor?: PersonaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Personas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Personas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Personas.
     */
    distinct?: PersonaScalarFieldEnum | PersonaScalarFieldEnum[]
  }

  /**
   * Persona findFirstOrThrow
   */
  export type PersonaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Persona
     */
    select?: PersonaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersonaInclude<ExtArgs> | null
    /**
     * Filter, which Persona to fetch.
     */
    where?: PersonaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Personas to fetch.
     */
    orderBy?: PersonaOrderByWithRelationInput | PersonaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Personas.
     */
    cursor?: PersonaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Personas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Personas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Personas.
     */
    distinct?: PersonaScalarFieldEnum | PersonaScalarFieldEnum[]
  }

  /**
   * Persona findMany
   */
  export type PersonaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Persona
     */
    select?: PersonaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersonaInclude<ExtArgs> | null
    /**
     * Filter, which Personas to fetch.
     */
    where?: PersonaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Personas to fetch.
     */
    orderBy?: PersonaOrderByWithRelationInput | PersonaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Personas.
     */
    cursor?: PersonaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Personas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Personas.
     */
    skip?: number
    distinct?: PersonaScalarFieldEnum | PersonaScalarFieldEnum[]
  }

  /**
   * Persona create
   */
  export type PersonaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Persona
     */
    select?: PersonaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersonaInclude<ExtArgs> | null
    /**
     * The data needed to create a Persona.
     */
    data: XOR<PersonaCreateInput, PersonaUncheckedCreateInput>
  }

  /**
   * Persona createMany
   */
  export type PersonaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Personas.
     */
    data: PersonaCreateManyInput | PersonaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Persona createManyAndReturn
   */
  export type PersonaCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Persona
     */
    select?: PersonaSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Personas.
     */
    data: PersonaCreateManyInput | PersonaCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersonaIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Persona update
   */
  export type PersonaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Persona
     */
    select?: PersonaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersonaInclude<ExtArgs> | null
    /**
     * The data needed to update a Persona.
     */
    data: XOR<PersonaUpdateInput, PersonaUncheckedUpdateInput>
    /**
     * Choose, which Persona to update.
     */
    where: PersonaWhereUniqueInput
  }

  /**
   * Persona updateMany
   */
  export type PersonaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Personas.
     */
    data: XOR<PersonaUpdateManyMutationInput, PersonaUncheckedUpdateManyInput>
    /**
     * Filter which Personas to update
     */
    where?: PersonaWhereInput
  }

  /**
   * Persona upsert
   */
  export type PersonaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Persona
     */
    select?: PersonaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersonaInclude<ExtArgs> | null
    /**
     * The filter to search for the Persona to update in case it exists.
     */
    where: PersonaWhereUniqueInput
    /**
     * In case the Persona found by the `where` argument doesn't exist, create a new Persona with this data.
     */
    create: XOR<PersonaCreateInput, PersonaUncheckedCreateInput>
    /**
     * In case the Persona was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PersonaUpdateInput, PersonaUncheckedUpdateInput>
  }

  /**
   * Persona delete
   */
  export type PersonaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Persona
     */
    select?: PersonaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersonaInclude<ExtArgs> | null
    /**
     * Filter which Persona to delete.
     */
    where: PersonaWhereUniqueInput
  }

  /**
   * Persona deleteMany
   */
  export type PersonaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Personas to delete
     */
    where?: PersonaWhereInput
  }

  /**
   * Persona.posts
   */
  export type Persona$postsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    where?: PostWhereInput
    orderBy?: PostOrderByWithRelationInput | PostOrderByWithRelationInput[]
    cursor?: PostWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PostScalarFieldEnum | PostScalarFieldEnum[]
  }

  /**
   * Persona without action
   */
  export type PersonaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Persona
     */
    select?: PersonaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersonaInclude<ExtArgs> | null
  }


  /**
   * Model NewsItem
   */

  export type AggregateNewsItem = {
    _count: NewsItemCountAggregateOutputType | null
    _avg: NewsItemAvgAggregateOutputType | null
    _sum: NewsItemSumAggregateOutputType | null
    _min: NewsItemMinAggregateOutputType | null
    _max: NewsItemMaxAggregateOutputType | null
  }

  export type NewsItemAvgAggregateOutputType = {
    sentimentScore: number | null
    impactScore: number | null
    controversyScore: number | null
  }

  export type NewsItemSumAggregateOutputType = {
    sentimentScore: number | null
    impactScore: number | null
    controversyScore: number | null
  }

  export type NewsItemMinAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    content: string | null
    url: string | null
    sourceName: string | null
    sourceUrl: string | null
    author: string | null
    category: $Enums.NewsCategory | null
    country: string | null
    region: string | null
    language: string | null
    sentimentScore: number | null
    impactScore: number | null
    controversyScore: number | null
    publishedAt: Date | null
    discoveredAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
    aiSummary: string | null
  }

  export type NewsItemMaxAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    content: string | null
    url: string | null
    sourceName: string | null
    sourceUrl: string | null
    author: string | null
    category: $Enums.NewsCategory | null
    country: string | null
    region: string | null
    language: string | null
    sentimentScore: number | null
    impactScore: number | null
    controversyScore: number | null
    publishedAt: Date | null
    discoveredAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
    aiSummary: string | null
  }

  export type NewsItemCountAggregateOutputType = {
    id: number
    title: number
    description: number
    content: number
    url: number
    sourceName: number
    sourceUrl: number
    author: number
    category: number
    topics: number
    keywords: number
    entities: number
    country: number
    region: number
    language: number
    sentimentScore: number
    impactScore: number
    controversyScore: number
    publishedAt: number
    discoveredAt: number
    createdAt: number
    updatedAt: number
    aiSummary: number
    topicTags: number
    _all: number
  }


  export type NewsItemAvgAggregateInputType = {
    sentimentScore?: true
    impactScore?: true
    controversyScore?: true
  }

  export type NewsItemSumAggregateInputType = {
    sentimentScore?: true
    impactScore?: true
    controversyScore?: true
  }

  export type NewsItemMinAggregateInputType = {
    id?: true
    title?: true
    description?: true
    content?: true
    url?: true
    sourceName?: true
    sourceUrl?: true
    author?: true
    category?: true
    country?: true
    region?: true
    language?: true
    sentimentScore?: true
    impactScore?: true
    controversyScore?: true
    publishedAt?: true
    discoveredAt?: true
    createdAt?: true
    updatedAt?: true
    aiSummary?: true
  }

  export type NewsItemMaxAggregateInputType = {
    id?: true
    title?: true
    description?: true
    content?: true
    url?: true
    sourceName?: true
    sourceUrl?: true
    author?: true
    category?: true
    country?: true
    region?: true
    language?: true
    sentimentScore?: true
    impactScore?: true
    controversyScore?: true
    publishedAt?: true
    discoveredAt?: true
    createdAt?: true
    updatedAt?: true
    aiSummary?: true
  }

  export type NewsItemCountAggregateInputType = {
    id?: true
    title?: true
    description?: true
    content?: true
    url?: true
    sourceName?: true
    sourceUrl?: true
    author?: true
    category?: true
    topics?: true
    keywords?: true
    entities?: true
    country?: true
    region?: true
    language?: true
    sentimentScore?: true
    impactScore?: true
    controversyScore?: true
    publishedAt?: true
    discoveredAt?: true
    createdAt?: true
    updatedAt?: true
    aiSummary?: true
    topicTags?: true
    _all?: true
  }

  export type NewsItemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NewsItem to aggregate.
     */
    where?: NewsItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NewsItems to fetch.
     */
    orderBy?: NewsItemOrderByWithRelationInput | NewsItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NewsItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NewsItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NewsItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned NewsItems
    **/
    _count?: true | NewsItemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: NewsItemAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: NewsItemSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NewsItemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NewsItemMaxAggregateInputType
  }

  export type GetNewsItemAggregateType<T extends NewsItemAggregateArgs> = {
        [P in keyof T & keyof AggregateNewsItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNewsItem[P]>
      : GetScalarType<T[P], AggregateNewsItem[P]>
  }




  export type NewsItemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NewsItemWhereInput
    orderBy?: NewsItemOrderByWithAggregationInput | NewsItemOrderByWithAggregationInput[]
    by: NewsItemScalarFieldEnum[] | NewsItemScalarFieldEnum
    having?: NewsItemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NewsItemCountAggregateInputType | true
    _avg?: NewsItemAvgAggregateInputType
    _sum?: NewsItemSumAggregateInputType
    _min?: NewsItemMinAggregateInputType
    _max?: NewsItemMaxAggregateInputType
  }

  export type NewsItemGroupByOutputType = {
    id: string
    title: string
    description: string
    content: string | null
    url: string
    sourceName: string
    sourceUrl: string
    author: string | null
    category: $Enums.NewsCategory
    topics: string[]
    keywords: string[]
    entities: string[]
    country: string | null
    region: string | null
    language: string
    sentimentScore: number
    impactScore: number
    controversyScore: number
    publishedAt: Date
    discoveredAt: Date
    createdAt: Date
    updatedAt: Date
    aiSummary: string | null
    topicTags: string[]
    _count: NewsItemCountAggregateOutputType | null
    _avg: NewsItemAvgAggregateOutputType | null
    _sum: NewsItemSumAggregateOutputType | null
    _min: NewsItemMinAggregateOutputType | null
    _max: NewsItemMaxAggregateOutputType | null
  }

  type GetNewsItemGroupByPayload<T extends NewsItemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NewsItemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NewsItemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NewsItemGroupByOutputType[P]>
            : GetScalarType<T[P], NewsItemGroupByOutputType[P]>
        }
      >
    >


  export type NewsItemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    content?: boolean
    url?: boolean
    sourceName?: boolean
    sourceUrl?: boolean
    author?: boolean
    category?: boolean
    topics?: boolean
    keywords?: boolean
    entities?: boolean
    country?: boolean
    region?: boolean
    language?: boolean
    sentimentScore?: boolean
    impactScore?: boolean
    controversyScore?: boolean
    publishedAt?: boolean
    discoveredAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    aiSummary?: boolean
    topicTags?: boolean
    trends?: boolean | NewsItem$trendsArgs<ExtArgs>
    relatedPosts?: boolean | NewsItem$relatedPostsArgs<ExtArgs>
    _count?: boolean | NewsItemCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["newsItem"]>

  export type NewsItemSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    content?: boolean
    url?: boolean
    sourceName?: boolean
    sourceUrl?: boolean
    author?: boolean
    category?: boolean
    topics?: boolean
    keywords?: boolean
    entities?: boolean
    country?: boolean
    region?: boolean
    language?: boolean
    sentimentScore?: boolean
    impactScore?: boolean
    controversyScore?: boolean
    publishedAt?: boolean
    discoveredAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    aiSummary?: boolean
    topicTags?: boolean
  }, ExtArgs["result"]["newsItem"]>

  export type NewsItemSelectScalar = {
    id?: boolean
    title?: boolean
    description?: boolean
    content?: boolean
    url?: boolean
    sourceName?: boolean
    sourceUrl?: boolean
    author?: boolean
    category?: boolean
    topics?: boolean
    keywords?: boolean
    entities?: boolean
    country?: boolean
    region?: boolean
    language?: boolean
    sentimentScore?: boolean
    impactScore?: boolean
    controversyScore?: boolean
    publishedAt?: boolean
    discoveredAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    aiSummary?: boolean
    topicTags?: boolean
  }

  export type NewsItemInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    trends?: boolean | NewsItem$trendsArgs<ExtArgs>
    relatedPosts?: boolean | NewsItem$relatedPostsArgs<ExtArgs>
    _count?: boolean | NewsItemCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type NewsItemIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $NewsItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "NewsItem"
    objects: {
      trends: Prisma.$TrendPayload<ExtArgs>[]
      relatedPosts: Prisma.$PostPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      description: string
      content: string | null
      url: string
      sourceName: string
      sourceUrl: string
      author: string | null
      category: $Enums.NewsCategory
      topics: string[]
      keywords: string[]
      entities: string[]
      country: string | null
      region: string | null
      language: string
      sentimentScore: number
      impactScore: number
      controversyScore: number
      publishedAt: Date
      discoveredAt: Date
      createdAt: Date
      updatedAt: Date
      aiSummary: string | null
      topicTags: string[]
    }, ExtArgs["result"]["newsItem"]>
    composites: {}
  }

  type NewsItemGetPayload<S extends boolean | null | undefined | NewsItemDefaultArgs> = $Result.GetResult<Prisma.$NewsItemPayload, S>

  type NewsItemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<NewsItemFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: NewsItemCountAggregateInputType | true
    }

  export interface NewsItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['NewsItem'], meta: { name: 'NewsItem' } }
    /**
     * Find zero or one NewsItem that matches the filter.
     * @param {NewsItemFindUniqueArgs} args - Arguments to find a NewsItem
     * @example
     * // Get one NewsItem
     * const newsItem = await prisma.newsItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NewsItemFindUniqueArgs>(args: SelectSubset<T, NewsItemFindUniqueArgs<ExtArgs>>): Prisma__NewsItemClient<$Result.GetResult<Prisma.$NewsItemPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one NewsItem that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {NewsItemFindUniqueOrThrowArgs} args - Arguments to find a NewsItem
     * @example
     * // Get one NewsItem
     * const newsItem = await prisma.newsItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NewsItemFindUniqueOrThrowArgs>(args: SelectSubset<T, NewsItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NewsItemClient<$Result.GetResult<Prisma.$NewsItemPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first NewsItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsItemFindFirstArgs} args - Arguments to find a NewsItem
     * @example
     * // Get one NewsItem
     * const newsItem = await prisma.newsItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NewsItemFindFirstArgs>(args?: SelectSubset<T, NewsItemFindFirstArgs<ExtArgs>>): Prisma__NewsItemClient<$Result.GetResult<Prisma.$NewsItemPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first NewsItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsItemFindFirstOrThrowArgs} args - Arguments to find a NewsItem
     * @example
     * // Get one NewsItem
     * const newsItem = await prisma.newsItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NewsItemFindFirstOrThrowArgs>(args?: SelectSubset<T, NewsItemFindFirstOrThrowArgs<ExtArgs>>): Prisma__NewsItemClient<$Result.GetResult<Prisma.$NewsItemPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more NewsItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all NewsItems
     * const newsItems = await prisma.newsItem.findMany()
     * 
     * // Get first 10 NewsItems
     * const newsItems = await prisma.newsItem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const newsItemWithIdOnly = await prisma.newsItem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends NewsItemFindManyArgs>(args?: SelectSubset<T, NewsItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NewsItemPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a NewsItem.
     * @param {NewsItemCreateArgs} args - Arguments to create a NewsItem.
     * @example
     * // Create one NewsItem
     * const NewsItem = await prisma.newsItem.create({
     *   data: {
     *     // ... data to create a NewsItem
     *   }
     * })
     * 
     */
    create<T extends NewsItemCreateArgs>(args: SelectSubset<T, NewsItemCreateArgs<ExtArgs>>): Prisma__NewsItemClient<$Result.GetResult<Prisma.$NewsItemPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many NewsItems.
     * @param {NewsItemCreateManyArgs} args - Arguments to create many NewsItems.
     * @example
     * // Create many NewsItems
     * const newsItem = await prisma.newsItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NewsItemCreateManyArgs>(args?: SelectSubset<T, NewsItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many NewsItems and returns the data saved in the database.
     * @param {NewsItemCreateManyAndReturnArgs} args - Arguments to create many NewsItems.
     * @example
     * // Create many NewsItems
     * const newsItem = await prisma.newsItem.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many NewsItems and only return the `id`
     * const newsItemWithIdOnly = await prisma.newsItem.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends NewsItemCreateManyAndReturnArgs>(args?: SelectSubset<T, NewsItemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NewsItemPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a NewsItem.
     * @param {NewsItemDeleteArgs} args - Arguments to delete one NewsItem.
     * @example
     * // Delete one NewsItem
     * const NewsItem = await prisma.newsItem.delete({
     *   where: {
     *     // ... filter to delete one NewsItem
     *   }
     * })
     * 
     */
    delete<T extends NewsItemDeleteArgs>(args: SelectSubset<T, NewsItemDeleteArgs<ExtArgs>>): Prisma__NewsItemClient<$Result.GetResult<Prisma.$NewsItemPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one NewsItem.
     * @param {NewsItemUpdateArgs} args - Arguments to update one NewsItem.
     * @example
     * // Update one NewsItem
     * const newsItem = await prisma.newsItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NewsItemUpdateArgs>(args: SelectSubset<T, NewsItemUpdateArgs<ExtArgs>>): Prisma__NewsItemClient<$Result.GetResult<Prisma.$NewsItemPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more NewsItems.
     * @param {NewsItemDeleteManyArgs} args - Arguments to filter NewsItems to delete.
     * @example
     * // Delete a few NewsItems
     * const { count } = await prisma.newsItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NewsItemDeleteManyArgs>(args?: SelectSubset<T, NewsItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more NewsItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many NewsItems
     * const newsItem = await prisma.newsItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NewsItemUpdateManyArgs>(args: SelectSubset<T, NewsItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one NewsItem.
     * @param {NewsItemUpsertArgs} args - Arguments to update or create a NewsItem.
     * @example
     * // Update or create a NewsItem
     * const newsItem = await prisma.newsItem.upsert({
     *   create: {
     *     // ... data to create a NewsItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the NewsItem we want to update
     *   }
     * })
     */
    upsert<T extends NewsItemUpsertArgs>(args: SelectSubset<T, NewsItemUpsertArgs<ExtArgs>>): Prisma__NewsItemClient<$Result.GetResult<Prisma.$NewsItemPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of NewsItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsItemCountArgs} args - Arguments to filter NewsItems to count.
     * @example
     * // Count the number of NewsItems
     * const count = await prisma.newsItem.count({
     *   where: {
     *     // ... the filter for the NewsItems we want to count
     *   }
     * })
    **/
    count<T extends NewsItemCountArgs>(
      args?: Subset<T, NewsItemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NewsItemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a NewsItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends NewsItemAggregateArgs>(args: Subset<T, NewsItemAggregateArgs>): Prisma.PrismaPromise<GetNewsItemAggregateType<T>>

    /**
     * Group by NewsItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsItemGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends NewsItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NewsItemGroupByArgs['orderBy'] }
        : { orderBy?: NewsItemGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, NewsItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNewsItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the NewsItem model
   */
  readonly fields: NewsItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for NewsItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NewsItemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    trends<T extends NewsItem$trendsArgs<ExtArgs> = {}>(args?: Subset<T, NewsItem$trendsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TrendPayload<ExtArgs>, T, "findMany"> | Null>
    relatedPosts<T extends NewsItem$relatedPostsArgs<ExtArgs> = {}>(args?: Subset<T, NewsItem$relatedPostsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the NewsItem model
   */ 
  interface NewsItemFieldRefs {
    readonly id: FieldRef<"NewsItem", 'String'>
    readonly title: FieldRef<"NewsItem", 'String'>
    readonly description: FieldRef<"NewsItem", 'String'>
    readonly content: FieldRef<"NewsItem", 'String'>
    readonly url: FieldRef<"NewsItem", 'String'>
    readonly sourceName: FieldRef<"NewsItem", 'String'>
    readonly sourceUrl: FieldRef<"NewsItem", 'String'>
    readonly author: FieldRef<"NewsItem", 'String'>
    readonly category: FieldRef<"NewsItem", 'NewsCategory'>
    readonly topics: FieldRef<"NewsItem", 'String[]'>
    readonly keywords: FieldRef<"NewsItem", 'String[]'>
    readonly entities: FieldRef<"NewsItem", 'String[]'>
    readonly country: FieldRef<"NewsItem", 'String'>
    readonly region: FieldRef<"NewsItem", 'String'>
    readonly language: FieldRef<"NewsItem", 'String'>
    readonly sentimentScore: FieldRef<"NewsItem", 'Float'>
    readonly impactScore: FieldRef<"NewsItem", 'Int'>
    readonly controversyScore: FieldRef<"NewsItem", 'Int'>
    readonly publishedAt: FieldRef<"NewsItem", 'DateTime'>
    readonly discoveredAt: FieldRef<"NewsItem", 'DateTime'>
    readonly createdAt: FieldRef<"NewsItem", 'DateTime'>
    readonly updatedAt: FieldRef<"NewsItem", 'DateTime'>
    readonly aiSummary: FieldRef<"NewsItem", 'String'>
    readonly topicTags: FieldRef<"NewsItem", 'String[]'>
  }
    

  // Custom InputTypes
  /**
   * NewsItem findUnique
   */
  export type NewsItemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsItem
     */
    select?: NewsItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsItemInclude<ExtArgs> | null
    /**
     * Filter, which NewsItem to fetch.
     */
    where: NewsItemWhereUniqueInput
  }

  /**
   * NewsItem findUniqueOrThrow
   */
  export type NewsItemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsItem
     */
    select?: NewsItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsItemInclude<ExtArgs> | null
    /**
     * Filter, which NewsItem to fetch.
     */
    where: NewsItemWhereUniqueInput
  }

  /**
   * NewsItem findFirst
   */
  export type NewsItemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsItem
     */
    select?: NewsItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsItemInclude<ExtArgs> | null
    /**
     * Filter, which NewsItem to fetch.
     */
    where?: NewsItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NewsItems to fetch.
     */
    orderBy?: NewsItemOrderByWithRelationInput | NewsItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NewsItems.
     */
    cursor?: NewsItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NewsItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NewsItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NewsItems.
     */
    distinct?: NewsItemScalarFieldEnum | NewsItemScalarFieldEnum[]
  }

  /**
   * NewsItem findFirstOrThrow
   */
  export type NewsItemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsItem
     */
    select?: NewsItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsItemInclude<ExtArgs> | null
    /**
     * Filter, which NewsItem to fetch.
     */
    where?: NewsItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NewsItems to fetch.
     */
    orderBy?: NewsItemOrderByWithRelationInput | NewsItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NewsItems.
     */
    cursor?: NewsItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NewsItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NewsItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NewsItems.
     */
    distinct?: NewsItemScalarFieldEnum | NewsItemScalarFieldEnum[]
  }

  /**
   * NewsItem findMany
   */
  export type NewsItemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsItem
     */
    select?: NewsItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsItemInclude<ExtArgs> | null
    /**
     * Filter, which NewsItems to fetch.
     */
    where?: NewsItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NewsItems to fetch.
     */
    orderBy?: NewsItemOrderByWithRelationInput | NewsItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing NewsItems.
     */
    cursor?: NewsItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NewsItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NewsItems.
     */
    skip?: number
    distinct?: NewsItemScalarFieldEnum | NewsItemScalarFieldEnum[]
  }

  /**
   * NewsItem create
   */
  export type NewsItemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsItem
     */
    select?: NewsItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsItemInclude<ExtArgs> | null
    /**
     * The data needed to create a NewsItem.
     */
    data: XOR<NewsItemCreateInput, NewsItemUncheckedCreateInput>
  }

  /**
   * NewsItem createMany
   */
  export type NewsItemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many NewsItems.
     */
    data: NewsItemCreateManyInput | NewsItemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * NewsItem createManyAndReturn
   */
  export type NewsItemCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsItem
     */
    select?: NewsItemSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many NewsItems.
     */
    data: NewsItemCreateManyInput | NewsItemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * NewsItem update
   */
  export type NewsItemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsItem
     */
    select?: NewsItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsItemInclude<ExtArgs> | null
    /**
     * The data needed to update a NewsItem.
     */
    data: XOR<NewsItemUpdateInput, NewsItemUncheckedUpdateInput>
    /**
     * Choose, which NewsItem to update.
     */
    where: NewsItemWhereUniqueInput
  }

  /**
   * NewsItem updateMany
   */
  export type NewsItemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update NewsItems.
     */
    data: XOR<NewsItemUpdateManyMutationInput, NewsItemUncheckedUpdateManyInput>
    /**
     * Filter which NewsItems to update
     */
    where?: NewsItemWhereInput
  }

  /**
   * NewsItem upsert
   */
  export type NewsItemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsItem
     */
    select?: NewsItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsItemInclude<ExtArgs> | null
    /**
     * The filter to search for the NewsItem to update in case it exists.
     */
    where: NewsItemWhereUniqueInput
    /**
     * In case the NewsItem found by the `where` argument doesn't exist, create a new NewsItem with this data.
     */
    create: XOR<NewsItemCreateInput, NewsItemUncheckedCreateInput>
    /**
     * In case the NewsItem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NewsItemUpdateInput, NewsItemUncheckedUpdateInput>
  }

  /**
   * NewsItem delete
   */
  export type NewsItemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsItem
     */
    select?: NewsItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsItemInclude<ExtArgs> | null
    /**
     * Filter which NewsItem to delete.
     */
    where: NewsItemWhereUniqueInput
  }

  /**
   * NewsItem deleteMany
   */
  export type NewsItemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NewsItems to delete
     */
    where?: NewsItemWhereInput
  }

  /**
   * NewsItem.trends
   */
  export type NewsItem$trendsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trend
     */
    select?: TrendSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrendInclude<ExtArgs> | null
    where?: TrendWhereInput
    orderBy?: TrendOrderByWithRelationInput | TrendOrderByWithRelationInput[]
    cursor?: TrendWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TrendScalarFieldEnum | TrendScalarFieldEnum[]
  }

  /**
   * NewsItem.relatedPosts
   */
  export type NewsItem$relatedPostsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    where?: PostWhereInput
    orderBy?: PostOrderByWithRelationInput | PostOrderByWithRelationInput[]
    cursor?: PostWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PostScalarFieldEnum | PostScalarFieldEnum[]
  }

  /**
   * NewsItem without action
   */
  export type NewsItemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsItem
     */
    select?: NewsItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsItemInclude<ExtArgs> | null
  }


  /**
   * Model Trend
   */

  export type AggregateTrend = {
    _count: TrendCountAggregateOutputType | null
    _avg: TrendAvgAggregateOutputType | null
    _sum: TrendSumAggregateOutputType | null
    _min: TrendMinAggregateOutputType | null
    _max: TrendMaxAggregateOutputType | null
  }

  export type TrendAvgAggregateOutputType = {
    postCount: number | null
    uniqueUsers: number | null
    impressionCount: number | null
    engagementCount: number | null
    trendScore: number | null
    velocity: number | null
  }

  export type TrendSumAggregateOutputType = {
    postCount: number | null
    uniqueUsers: number | null
    impressionCount: number | null
    engagementCount: number | null
    trendScore: number | null
    velocity: number | null
  }

  export type TrendMinAggregateOutputType = {
    id: string | null
    hashtag: string | null
    keyword: string | null
    topic: string | null
    postCount: number | null
    uniqueUsers: number | null
    impressionCount: number | null
    engagementCount: number | null
    trendScore: number | null
    velocity: number | null
    peakTime: Date | null
    category: $Enums.TrendCategory | null
    region: string | null
    language: string | null
    isPromoted: boolean | null
    isHidden: boolean | null
    startedAt: Date | null
    endedAt: Date | null
    lastUpdated: Date | null
    createdAt: Date | null
  }

  export type TrendMaxAggregateOutputType = {
    id: string | null
    hashtag: string | null
    keyword: string | null
    topic: string | null
    postCount: number | null
    uniqueUsers: number | null
    impressionCount: number | null
    engagementCount: number | null
    trendScore: number | null
    velocity: number | null
    peakTime: Date | null
    category: $Enums.TrendCategory | null
    region: string | null
    language: string | null
    isPromoted: boolean | null
    isHidden: boolean | null
    startedAt: Date | null
    endedAt: Date | null
    lastUpdated: Date | null
    createdAt: Date | null
  }

  export type TrendCountAggregateOutputType = {
    id: number
    hashtag: number
    keyword: number
    topic: number
    postCount: number
    uniqueUsers: number
    impressionCount: number
    engagementCount: number
    trendScore: number
    velocity: number
    peakTime: number
    category: number
    region: number
    language: number
    isPromoted: number
    isHidden: number
    startedAt: number
    endedAt: number
    lastUpdated: number
    createdAt: number
    _all: number
  }


  export type TrendAvgAggregateInputType = {
    postCount?: true
    uniqueUsers?: true
    impressionCount?: true
    engagementCount?: true
    trendScore?: true
    velocity?: true
  }

  export type TrendSumAggregateInputType = {
    postCount?: true
    uniqueUsers?: true
    impressionCount?: true
    engagementCount?: true
    trendScore?: true
    velocity?: true
  }

  export type TrendMinAggregateInputType = {
    id?: true
    hashtag?: true
    keyword?: true
    topic?: true
    postCount?: true
    uniqueUsers?: true
    impressionCount?: true
    engagementCount?: true
    trendScore?: true
    velocity?: true
    peakTime?: true
    category?: true
    region?: true
    language?: true
    isPromoted?: true
    isHidden?: true
    startedAt?: true
    endedAt?: true
    lastUpdated?: true
    createdAt?: true
  }

  export type TrendMaxAggregateInputType = {
    id?: true
    hashtag?: true
    keyword?: true
    topic?: true
    postCount?: true
    uniqueUsers?: true
    impressionCount?: true
    engagementCount?: true
    trendScore?: true
    velocity?: true
    peakTime?: true
    category?: true
    region?: true
    language?: true
    isPromoted?: true
    isHidden?: true
    startedAt?: true
    endedAt?: true
    lastUpdated?: true
    createdAt?: true
  }

  export type TrendCountAggregateInputType = {
    id?: true
    hashtag?: true
    keyword?: true
    topic?: true
    postCount?: true
    uniqueUsers?: true
    impressionCount?: true
    engagementCount?: true
    trendScore?: true
    velocity?: true
    peakTime?: true
    category?: true
    region?: true
    language?: true
    isPromoted?: true
    isHidden?: true
    startedAt?: true
    endedAt?: true
    lastUpdated?: true
    createdAt?: true
    _all?: true
  }

  export type TrendAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Trend to aggregate.
     */
    where?: TrendWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Trends to fetch.
     */
    orderBy?: TrendOrderByWithRelationInput | TrendOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TrendWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Trends from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Trends.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Trends
    **/
    _count?: true | TrendCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TrendAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TrendSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TrendMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TrendMaxAggregateInputType
  }

  export type GetTrendAggregateType<T extends TrendAggregateArgs> = {
        [P in keyof T & keyof AggregateTrend]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTrend[P]>
      : GetScalarType<T[P], AggregateTrend[P]>
  }




  export type TrendGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TrendWhereInput
    orderBy?: TrendOrderByWithAggregationInput | TrendOrderByWithAggregationInput[]
    by: TrendScalarFieldEnum[] | TrendScalarFieldEnum
    having?: TrendScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TrendCountAggregateInputType | true
    _avg?: TrendAvgAggregateInputType
    _sum?: TrendSumAggregateInputType
    _min?: TrendMinAggregateInputType
    _max?: TrendMaxAggregateInputType
  }

  export type TrendGroupByOutputType = {
    id: string
    hashtag: string | null
    keyword: string | null
    topic: string
    postCount: number
    uniqueUsers: number
    impressionCount: number
    engagementCount: number
    trendScore: number
    velocity: number
    peakTime: Date | null
    category: $Enums.TrendCategory
    region: string | null
    language: string
    isPromoted: boolean
    isHidden: boolean
    startedAt: Date
    endedAt: Date | null
    lastUpdated: Date
    createdAt: Date
    _count: TrendCountAggregateOutputType | null
    _avg: TrendAvgAggregateOutputType | null
    _sum: TrendSumAggregateOutputType | null
    _min: TrendMinAggregateOutputType | null
    _max: TrendMaxAggregateOutputType | null
  }

  type GetTrendGroupByPayload<T extends TrendGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TrendGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TrendGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TrendGroupByOutputType[P]>
            : GetScalarType<T[P], TrendGroupByOutputType[P]>
        }
      >
    >


  export type TrendSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    hashtag?: boolean
    keyword?: boolean
    topic?: boolean
    postCount?: boolean
    uniqueUsers?: boolean
    impressionCount?: boolean
    engagementCount?: boolean
    trendScore?: boolean
    velocity?: boolean
    peakTime?: boolean
    category?: boolean
    region?: boolean
    language?: boolean
    isPromoted?: boolean
    isHidden?: boolean
    startedAt?: boolean
    endedAt?: boolean
    lastUpdated?: boolean
    createdAt?: boolean
    newsItems?: boolean | Trend$newsItemsArgs<ExtArgs>
    _count?: boolean | TrendCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["trend"]>

  export type TrendSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    hashtag?: boolean
    keyword?: boolean
    topic?: boolean
    postCount?: boolean
    uniqueUsers?: boolean
    impressionCount?: boolean
    engagementCount?: boolean
    trendScore?: boolean
    velocity?: boolean
    peakTime?: boolean
    category?: boolean
    region?: boolean
    language?: boolean
    isPromoted?: boolean
    isHidden?: boolean
    startedAt?: boolean
    endedAt?: boolean
    lastUpdated?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["trend"]>

  export type TrendSelectScalar = {
    id?: boolean
    hashtag?: boolean
    keyword?: boolean
    topic?: boolean
    postCount?: boolean
    uniqueUsers?: boolean
    impressionCount?: boolean
    engagementCount?: boolean
    trendScore?: boolean
    velocity?: boolean
    peakTime?: boolean
    category?: boolean
    region?: boolean
    language?: boolean
    isPromoted?: boolean
    isHidden?: boolean
    startedAt?: boolean
    endedAt?: boolean
    lastUpdated?: boolean
    createdAt?: boolean
  }

  export type TrendInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    newsItems?: boolean | Trend$newsItemsArgs<ExtArgs>
    _count?: boolean | TrendCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TrendIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $TrendPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Trend"
    objects: {
      newsItems: Prisma.$NewsItemPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      hashtag: string | null
      keyword: string | null
      topic: string
      postCount: number
      uniqueUsers: number
      impressionCount: number
      engagementCount: number
      trendScore: number
      velocity: number
      peakTime: Date | null
      category: $Enums.TrendCategory
      region: string | null
      language: string
      isPromoted: boolean
      isHidden: boolean
      startedAt: Date
      endedAt: Date | null
      lastUpdated: Date
      createdAt: Date
    }, ExtArgs["result"]["trend"]>
    composites: {}
  }

  type TrendGetPayload<S extends boolean | null | undefined | TrendDefaultArgs> = $Result.GetResult<Prisma.$TrendPayload, S>

  type TrendCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<TrendFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: TrendCountAggregateInputType | true
    }

  export interface TrendDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Trend'], meta: { name: 'Trend' } }
    /**
     * Find zero or one Trend that matches the filter.
     * @param {TrendFindUniqueArgs} args - Arguments to find a Trend
     * @example
     * // Get one Trend
     * const trend = await prisma.trend.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TrendFindUniqueArgs>(args: SelectSubset<T, TrendFindUniqueArgs<ExtArgs>>): Prisma__TrendClient<$Result.GetResult<Prisma.$TrendPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Trend that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {TrendFindUniqueOrThrowArgs} args - Arguments to find a Trend
     * @example
     * // Get one Trend
     * const trend = await prisma.trend.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TrendFindUniqueOrThrowArgs>(args: SelectSubset<T, TrendFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TrendClient<$Result.GetResult<Prisma.$TrendPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Trend that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrendFindFirstArgs} args - Arguments to find a Trend
     * @example
     * // Get one Trend
     * const trend = await prisma.trend.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TrendFindFirstArgs>(args?: SelectSubset<T, TrendFindFirstArgs<ExtArgs>>): Prisma__TrendClient<$Result.GetResult<Prisma.$TrendPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Trend that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrendFindFirstOrThrowArgs} args - Arguments to find a Trend
     * @example
     * // Get one Trend
     * const trend = await prisma.trend.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TrendFindFirstOrThrowArgs>(args?: SelectSubset<T, TrendFindFirstOrThrowArgs<ExtArgs>>): Prisma__TrendClient<$Result.GetResult<Prisma.$TrendPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Trends that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrendFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Trends
     * const trends = await prisma.trend.findMany()
     * 
     * // Get first 10 Trends
     * const trends = await prisma.trend.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const trendWithIdOnly = await prisma.trend.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TrendFindManyArgs>(args?: SelectSubset<T, TrendFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TrendPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Trend.
     * @param {TrendCreateArgs} args - Arguments to create a Trend.
     * @example
     * // Create one Trend
     * const Trend = await prisma.trend.create({
     *   data: {
     *     // ... data to create a Trend
     *   }
     * })
     * 
     */
    create<T extends TrendCreateArgs>(args: SelectSubset<T, TrendCreateArgs<ExtArgs>>): Prisma__TrendClient<$Result.GetResult<Prisma.$TrendPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Trends.
     * @param {TrendCreateManyArgs} args - Arguments to create many Trends.
     * @example
     * // Create many Trends
     * const trend = await prisma.trend.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TrendCreateManyArgs>(args?: SelectSubset<T, TrendCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Trends and returns the data saved in the database.
     * @param {TrendCreateManyAndReturnArgs} args - Arguments to create many Trends.
     * @example
     * // Create many Trends
     * const trend = await prisma.trend.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Trends and only return the `id`
     * const trendWithIdOnly = await prisma.trend.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TrendCreateManyAndReturnArgs>(args?: SelectSubset<T, TrendCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TrendPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Trend.
     * @param {TrendDeleteArgs} args - Arguments to delete one Trend.
     * @example
     * // Delete one Trend
     * const Trend = await prisma.trend.delete({
     *   where: {
     *     // ... filter to delete one Trend
     *   }
     * })
     * 
     */
    delete<T extends TrendDeleteArgs>(args: SelectSubset<T, TrendDeleteArgs<ExtArgs>>): Prisma__TrendClient<$Result.GetResult<Prisma.$TrendPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Trend.
     * @param {TrendUpdateArgs} args - Arguments to update one Trend.
     * @example
     * // Update one Trend
     * const trend = await prisma.trend.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TrendUpdateArgs>(args: SelectSubset<T, TrendUpdateArgs<ExtArgs>>): Prisma__TrendClient<$Result.GetResult<Prisma.$TrendPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Trends.
     * @param {TrendDeleteManyArgs} args - Arguments to filter Trends to delete.
     * @example
     * // Delete a few Trends
     * const { count } = await prisma.trend.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TrendDeleteManyArgs>(args?: SelectSubset<T, TrendDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Trends.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrendUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Trends
     * const trend = await prisma.trend.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TrendUpdateManyArgs>(args: SelectSubset<T, TrendUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Trend.
     * @param {TrendUpsertArgs} args - Arguments to update or create a Trend.
     * @example
     * // Update or create a Trend
     * const trend = await prisma.trend.upsert({
     *   create: {
     *     // ... data to create a Trend
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Trend we want to update
     *   }
     * })
     */
    upsert<T extends TrendUpsertArgs>(args: SelectSubset<T, TrendUpsertArgs<ExtArgs>>): Prisma__TrendClient<$Result.GetResult<Prisma.$TrendPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Trends.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrendCountArgs} args - Arguments to filter Trends to count.
     * @example
     * // Count the number of Trends
     * const count = await prisma.trend.count({
     *   where: {
     *     // ... the filter for the Trends we want to count
     *   }
     * })
    **/
    count<T extends TrendCountArgs>(
      args?: Subset<T, TrendCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TrendCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Trend.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrendAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TrendAggregateArgs>(args: Subset<T, TrendAggregateArgs>): Prisma.PrismaPromise<GetTrendAggregateType<T>>

    /**
     * Group by Trend.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrendGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TrendGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TrendGroupByArgs['orderBy'] }
        : { orderBy?: TrendGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TrendGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTrendGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Trend model
   */
  readonly fields: TrendFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Trend.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TrendClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    newsItems<T extends Trend$newsItemsArgs<ExtArgs> = {}>(args?: Subset<T, Trend$newsItemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NewsItemPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Trend model
   */ 
  interface TrendFieldRefs {
    readonly id: FieldRef<"Trend", 'String'>
    readonly hashtag: FieldRef<"Trend", 'String'>
    readonly keyword: FieldRef<"Trend", 'String'>
    readonly topic: FieldRef<"Trend", 'String'>
    readonly postCount: FieldRef<"Trend", 'Int'>
    readonly uniqueUsers: FieldRef<"Trend", 'Int'>
    readonly impressionCount: FieldRef<"Trend", 'Int'>
    readonly engagementCount: FieldRef<"Trend", 'Int'>
    readonly trendScore: FieldRef<"Trend", 'Int'>
    readonly velocity: FieldRef<"Trend", 'Float'>
    readonly peakTime: FieldRef<"Trend", 'DateTime'>
    readonly category: FieldRef<"Trend", 'TrendCategory'>
    readonly region: FieldRef<"Trend", 'String'>
    readonly language: FieldRef<"Trend", 'String'>
    readonly isPromoted: FieldRef<"Trend", 'Boolean'>
    readonly isHidden: FieldRef<"Trend", 'Boolean'>
    readonly startedAt: FieldRef<"Trend", 'DateTime'>
    readonly endedAt: FieldRef<"Trend", 'DateTime'>
    readonly lastUpdated: FieldRef<"Trend", 'DateTime'>
    readonly createdAt: FieldRef<"Trend", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Trend findUnique
   */
  export type TrendFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trend
     */
    select?: TrendSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrendInclude<ExtArgs> | null
    /**
     * Filter, which Trend to fetch.
     */
    where: TrendWhereUniqueInput
  }

  /**
   * Trend findUniqueOrThrow
   */
  export type TrendFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trend
     */
    select?: TrendSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrendInclude<ExtArgs> | null
    /**
     * Filter, which Trend to fetch.
     */
    where: TrendWhereUniqueInput
  }

  /**
   * Trend findFirst
   */
  export type TrendFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trend
     */
    select?: TrendSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrendInclude<ExtArgs> | null
    /**
     * Filter, which Trend to fetch.
     */
    where?: TrendWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Trends to fetch.
     */
    orderBy?: TrendOrderByWithRelationInput | TrendOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Trends.
     */
    cursor?: TrendWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Trends from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Trends.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Trends.
     */
    distinct?: TrendScalarFieldEnum | TrendScalarFieldEnum[]
  }

  /**
   * Trend findFirstOrThrow
   */
  export type TrendFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trend
     */
    select?: TrendSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrendInclude<ExtArgs> | null
    /**
     * Filter, which Trend to fetch.
     */
    where?: TrendWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Trends to fetch.
     */
    orderBy?: TrendOrderByWithRelationInput | TrendOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Trends.
     */
    cursor?: TrendWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Trends from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Trends.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Trends.
     */
    distinct?: TrendScalarFieldEnum | TrendScalarFieldEnum[]
  }

  /**
   * Trend findMany
   */
  export type TrendFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trend
     */
    select?: TrendSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrendInclude<ExtArgs> | null
    /**
     * Filter, which Trends to fetch.
     */
    where?: TrendWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Trends to fetch.
     */
    orderBy?: TrendOrderByWithRelationInput | TrendOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Trends.
     */
    cursor?: TrendWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Trends from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Trends.
     */
    skip?: number
    distinct?: TrendScalarFieldEnum | TrendScalarFieldEnum[]
  }

  /**
   * Trend create
   */
  export type TrendCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trend
     */
    select?: TrendSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrendInclude<ExtArgs> | null
    /**
     * The data needed to create a Trend.
     */
    data: XOR<TrendCreateInput, TrendUncheckedCreateInput>
  }

  /**
   * Trend createMany
   */
  export type TrendCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Trends.
     */
    data: TrendCreateManyInput | TrendCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Trend createManyAndReturn
   */
  export type TrendCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trend
     */
    select?: TrendSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Trends.
     */
    data: TrendCreateManyInput | TrendCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Trend update
   */
  export type TrendUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trend
     */
    select?: TrendSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrendInclude<ExtArgs> | null
    /**
     * The data needed to update a Trend.
     */
    data: XOR<TrendUpdateInput, TrendUncheckedUpdateInput>
    /**
     * Choose, which Trend to update.
     */
    where: TrendWhereUniqueInput
  }

  /**
   * Trend updateMany
   */
  export type TrendUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Trends.
     */
    data: XOR<TrendUpdateManyMutationInput, TrendUncheckedUpdateManyInput>
    /**
     * Filter which Trends to update
     */
    where?: TrendWhereInput
  }

  /**
   * Trend upsert
   */
  export type TrendUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trend
     */
    select?: TrendSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrendInclude<ExtArgs> | null
    /**
     * The filter to search for the Trend to update in case it exists.
     */
    where: TrendWhereUniqueInput
    /**
     * In case the Trend found by the `where` argument doesn't exist, create a new Trend with this data.
     */
    create: XOR<TrendCreateInput, TrendUncheckedCreateInput>
    /**
     * In case the Trend was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TrendUpdateInput, TrendUncheckedUpdateInput>
  }

  /**
   * Trend delete
   */
  export type TrendDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trend
     */
    select?: TrendSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrendInclude<ExtArgs> | null
    /**
     * Filter which Trend to delete.
     */
    where: TrendWhereUniqueInput
  }

  /**
   * Trend deleteMany
   */
  export type TrendDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Trends to delete
     */
    where?: TrendWhereInput
  }

  /**
   * Trend.newsItems
   */
  export type Trend$newsItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsItem
     */
    select?: NewsItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsItemInclude<ExtArgs> | null
    where?: NewsItemWhereInput
    orderBy?: NewsItemOrderByWithRelationInput | NewsItemOrderByWithRelationInput[]
    cursor?: NewsItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: NewsItemScalarFieldEnum | NewsItemScalarFieldEnum[]
  }

  /**
   * Trend without action
   */
  export type TrendDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trend
     */
    select?: TrendSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrendInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserAccountScalarFieldEnum: {
    id: 'id',
    username: 'username',
    email: 'email',
    passwordHash: 'passwordHash',
    emailVerified: 'emailVerified',
    isActive: 'isActive',
    lastLoginAt: 'lastLoginAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserAccountScalarFieldEnum = (typeof UserAccountScalarFieldEnum)[keyof typeof UserAccountScalarFieldEnum]


  export const UserProfileScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    displayName: 'displayName',
    bio: 'bio',
    profileImageUrl: 'profileImageUrl',
    headerImageUrl: 'headerImageUrl',
    location: 'location',
    website: 'website',
    personaType: 'personaType',
    specialtyAreas: 'specialtyAreas',
    verificationBadge: 'verificationBadge',
    followerCount: 'followerCount',
    followingCount: 'followingCount',
    postCount: 'postCount',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserProfileScalarFieldEnum = (typeof UserProfileScalarFieldEnum)[keyof typeof UserProfileScalarFieldEnum]


  export const PoliticalAlignmentScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    economicPosition: 'economicPosition',
    socialPosition: 'socialPosition',
    primaryIssues: 'primaryIssues',
    partyAffiliation: 'partyAffiliation',
    ideologyTags: 'ideologyTags',
    debateWillingness: 'debateWillingness',
    controversyTolerance: 'controversyTolerance',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PoliticalAlignmentScalarFieldEnum = (typeof PoliticalAlignmentScalarFieldEnum)[keyof typeof PoliticalAlignmentScalarFieldEnum]


  export const InfluenceMetricsScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    followerCount: 'followerCount',
    followingCount: 'followingCount',
    engagementRate: 'engagementRate',
    reachScore: 'reachScore',
    approvalRating: 'approvalRating',
    controversyLevel: 'controversyLevel',
    trendingScore: 'trendingScore',
    followerGrowthDaily: 'followerGrowthDaily',
    followerGrowthWeekly: 'followerGrowthWeekly',
    followerGrowthMonthly: 'followerGrowthMonthly',
    totalLikes: 'totalLikes',
    totalReshares: 'totalReshares',
    totalComments: 'totalComments',
    influenceRank: 'influenceRank',
    categoryRank: 'categoryRank',
    lastUpdated: 'lastUpdated',
    createdAt: 'createdAt'
  };

  export type InfluenceMetricsScalarFieldEnum = (typeof InfluenceMetricsScalarFieldEnum)[keyof typeof InfluenceMetricsScalarFieldEnum]


  export const SettingsScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    newsRegion: 'newsRegion',
    newsCategories: 'newsCategories',
    newsLanguages: 'newsLanguages',
    aiChatterLevel: 'aiChatterLevel',
    aiPersonalities: 'aiPersonalities',
    aiResponseTone: 'aiResponseTone',
    emailNotifications: 'emailNotifications',
    pushNotifications: 'pushNotifications',
    notificationCategories: 'notificationCategories',
    profileVisibility: 'profileVisibility',
    allowPersonaInteractions: 'allowPersonaInteractions',
    allowDataForAI: 'allowDataForAI',
    theme: 'theme',
    language: 'language',
    timezone: 'timezone',
    customAIApiKey: 'customAIApiKey',
    customAIBaseUrl: 'customAIBaseUrl',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SettingsScalarFieldEnum = (typeof SettingsScalarFieldEnum)[keyof typeof SettingsScalarFieldEnum]


  export const PostScalarFieldEnum: {
    id: 'id',
    authorId: 'authorId',
    personaId: 'personaId',
    content: 'content',
    mediaUrls: 'mediaUrls',
    linkPreview: 'linkPreview',
    threadId: 'threadId',
    parentPostId: 'parentPostId',
    repostOfId: 'repostOfId',
    isAIGenerated: 'isAIGenerated',
    hashtags: 'hashtags',
    mentions: 'mentions',
    newsItemId: 'newsItemId',
    newsContext: 'newsContext',
    likeCount: 'likeCount',
    repostCount: 'repostCount',
    commentCount: 'commentCount',
    impressionCount: 'impressionCount',
    contentWarning: 'contentWarning',
    isHidden: 'isHidden',
    reportCount: 'reportCount',
    publishedAt: 'publishedAt',
    editedAt: 'editedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PostScalarFieldEnum = (typeof PostScalarFieldEnum)[keyof typeof PostScalarFieldEnum]


  export const ThreadScalarFieldEnum: {
    id: 'id',
    originalPostId: 'originalPostId',
    title: 'title',
    participantCount: 'participantCount',
    postCount: 'postCount',
    maxDepth: 'maxDepth',
    totalLikes: 'totalLikes',
    totalReshares: 'totalReshares',
    lastActivityAt: 'lastActivityAt',
    isLocked: 'isLocked',
    isHidden: 'isHidden',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ThreadScalarFieldEnum = (typeof ThreadScalarFieldEnum)[keyof typeof ThreadScalarFieldEnum]


  export const ReactionScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    postId: 'postId',
    type: 'type',
    createdAt: 'createdAt'
  };

  export type ReactionScalarFieldEnum = (typeof ReactionScalarFieldEnum)[keyof typeof ReactionScalarFieldEnum]


  export const PersonaScalarFieldEnum: {
    id: 'id',
    name: 'name',
    handle: 'handle',
    bio: 'bio',
    profileImageUrl: 'profileImageUrl',
    personaType: 'personaType',
    personalityTraits: 'personalityTraits',
    interests: 'interests',
    expertise: 'expertise',
    toneStyle: 'toneStyle',
    controversyTolerance: 'controversyTolerance',
    engagementFrequency: 'engagementFrequency',
    debateAggression: 'debateAggression',
    politicalAlignmentId: 'politicalAlignmentId',
    aiProvider: 'aiProvider',
    systemPrompt: 'systemPrompt',
    contextWindow: 'contextWindow',
    postingSchedule: 'postingSchedule',
    timezonePreference: 'timezonePreference',
    isActive: 'isActive',
    isDefault: 'isDefault',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PersonaScalarFieldEnum = (typeof PersonaScalarFieldEnum)[keyof typeof PersonaScalarFieldEnum]


  export const NewsItemScalarFieldEnum: {
    id: 'id',
    title: 'title',
    description: 'description',
    content: 'content',
    url: 'url',
    sourceName: 'sourceName',
    sourceUrl: 'sourceUrl',
    author: 'author',
    category: 'category',
    topics: 'topics',
    keywords: 'keywords',
    entities: 'entities',
    country: 'country',
    region: 'region',
    language: 'language',
    sentimentScore: 'sentimentScore',
    impactScore: 'impactScore',
    controversyScore: 'controversyScore',
    publishedAt: 'publishedAt',
    discoveredAt: 'discoveredAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    aiSummary: 'aiSummary',
    topicTags: 'topicTags'
  };

  export type NewsItemScalarFieldEnum = (typeof NewsItemScalarFieldEnum)[keyof typeof NewsItemScalarFieldEnum]


  export const TrendScalarFieldEnum: {
    id: 'id',
    hashtag: 'hashtag',
    keyword: 'keyword',
    topic: 'topic',
    postCount: 'postCount',
    uniqueUsers: 'uniqueUsers',
    impressionCount: 'impressionCount',
    engagementCount: 'engagementCount',
    trendScore: 'trendScore',
    velocity: 'velocity',
    peakTime: 'peakTime',
    category: 'category',
    region: 'region',
    language: 'language',
    isPromoted: 'isPromoted',
    isHidden: 'isHidden',
    startedAt: 'startedAt',
    endedAt: 'endedAt',
    lastUpdated: 'lastUpdated',
    createdAt: 'createdAt'
  };

  export type TrendScalarFieldEnum = (typeof TrendScalarFieldEnum)[keyof typeof TrendScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'PersonaType'
   */
  export type EnumPersonaTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PersonaType'>
    


  /**
   * Reference to a field of type 'PersonaType[]'
   */
  export type ListEnumPersonaTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PersonaType[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'NewsCategory[]'
   */
  export type ListEnumNewsCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'NewsCategory[]'>
    


  /**
   * Reference to a field of type 'NewsCategory'
   */
  export type EnumNewsCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'NewsCategory'>
    


  /**
   * Reference to a field of type 'ToneStyle'
   */
  export type EnumToneStyleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ToneStyle'>
    


  /**
   * Reference to a field of type 'ToneStyle[]'
   */
  export type ListEnumToneStyleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ToneStyle[]'>
    


  /**
   * Reference to a field of type 'NotificationCategory[]'
   */
  export type ListEnumNotificationCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'NotificationCategory[]'>
    


  /**
   * Reference to a field of type 'NotificationCategory'
   */
  export type EnumNotificationCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'NotificationCategory'>
    


  /**
   * Reference to a field of type 'ProfileVisibility'
   */
  export type EnumProfileVisibilityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ProfileVisibility'>
    


  /**
   * Reference to a field of type 'ProfileVisibility[]'
   */
  export type ListEnumProfileVisibilityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ProfileVisibility[]'>
    


  /**
   * Reference to a field of type 'Theme'
   */
  export type EnumThemeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Theme'>
    


  /**
   * Reference to a field of type 'Theme[]'
   */
  export type ListEnumThemeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Theme[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'ReactionType'
   */
  export type EnumReactionTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ReactionType'>
    


  /**
   * Reference to a field of type 'ReactionType[]'
   */
  export type ListEnumReactionTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ReactionType[]'>
    


  /**
   * Reference to a field of type 'TrendCategory'
   */
  export type EnumTrendCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TrendCategory'>
    


  /**
   * Reference to a field of type 'TrendCategory[]'
   */
  export type ListEnumTrendCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TrendCategory[]'>
    
  /**
   * Deep Input Types
   */


  export type UserAccountWhereInput = {
    AND?: UserAccountWhereInput | UserAccountWhereInput[]
    OR?: UserAccountWhereInput[]
    NOT?: UserAccountWhereInput | UserAccountWhereInput[]
    id?: StringFilter<"UserAccount"> | string
    username?: StringFilter<"UserAccount"> | string
    email?: StringFilter<"UserAccount"> | string
    passwordHash?: StringFilter<"UserAccount"> | string
    emailVerified?: BoolFilter<"UserAccount"> | boolean
    isActive?: BoolFilter<"UserAccount"> | boolean
    lastLoginAt?: DateTimeNullableFilter<"UserAccount"> | Date | string | null
    createdAt?: DateTimeFilter<"UserAccount"> | Date | string
    updatedAt?: DateTimeFilter<"UserAccount"> | Date | string
    profile?: XOR<UserProfileNullableRelationFilter, UserProfileWhereInput> | null
    politicalAlignment?: XOR<PoliticalAlignmentNullableRelationFilter, PoliticalAlignmentWhereInput> | null
    influenceMetrics?: XOR<InfluenceMetricsNullableRelationFilter, InfluenceMetricsWhereInput> | null
    settings?: XOR<SettingsNullableRelationFilter, SettingsWhereInput> | null
    posts?: PostListRelationFilter
    reactions?: ReactionListRelationFilter
  }

  export type UserAccountOrderByWithRelationInput = {
    id?: SortOrder
    username?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    emailVerified?: SortOrder
    isActive?: SortOrder
    lastLoginAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    profile?: UserProfileOrderByWithRelationInput
    politicalAlignment?: PoliticalAlignmentOrderByWithRelationInput
    influenceMetrics?: InfluenceMetricsOrderByWithRelationInput
    settings?: SettingsOrderByWithRelationInput
    posts?: PostOrderByRelationAggregateInput
    reactions?: ReactionOrderByRelationAggregateInput
  }

  export type UserAccountWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    username?: string
    email?: string
    AND?: UserAccountWhereInput | UserAccountWhereInput[]
    OR?: UserAccountWhereInput[]
    NOT?: UserAccountWhereInput | UserAccountWhereInput[]
    passwordHash?: StringFilter<"UserAccount"> | string
    emailVerified?: BoolFilter<"UserAccount"> | boolean
    isActive?: BoolFilter<"UserAccount"> | boolean
    lastLoginAt?: DateTimeNullableFilter<"UserAccount"> | Date | string | null
    createdAt?: DateTimeFilter<"UserAccount"> | Date | string
    updatedAt?: DateTimeFilter<"UserAccount"> | Date | string
    profile?: XOR<UserProfileNullableRelationFilter, UserProfileWhereInput> | null
    politicalAlignment?: XOR<PoliticalAlignmentNullableRelationFilter, PoliticalAlignmentWhereInput> | null
    influenceMetrics?: XOR<InfluenceMetricsNullableRelationFilter, InfluenceMetricsWhereInput> | null
    settings?: XOR<SettingsNullableRelationFilter, SettingsWhereInput> | null
    posts?: PostListRelationFilter
    reactions?: ReactionListRelationFilter
  }, "id" | "username" | "email">

  export type UserAccountOrderByWithAggregationInput = {
    id?: SortOrder
    username?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    emailVerified?: SortOrder
    isActive?: SortOrder
    lastLoginAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserAccountCountOrderByAggregateInput
    _max?: UserAccountMaxOrderByAggregateInput
    _min?: UserAccountMinOrderByAggregateInput
  }

  export type UserAccountScalarWhereWithAggregatesInput = {
    AND?: UserAccountScalarWhereWithAggregatesInput | UserAccountScalarWhereWithAggregatesInput[]
    OR?: UserAccountScalarWhereWithAggregatesInput[]
    NOT?: UserAccountScalarWhereWithAggregatesInput | UserAccountScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"UserAccount"> | string
    username?: StringWithAggregatesFilter<"UserAccount"> | string
    email?: StringWithAggregatesFilter<"UserAccount"> | string
    passwordHash?: StringWithAggregatesFilter<"UserAccount"> | string
    emailVerified?: BoolWithAggregatesFilter<"UserAccount"> | boolean
    isActive?: BoolWithAggregatesFilter<"UserAccount"> | boolean
    lastLoginAt?: DateTimeNullableWithAggregatesFilter<"UserAccount"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"UserAccount"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"UserAccount"> | Date | string
  }

  export type UserProfileWhereInput = {
    AND?: UserProfileWhereInput | UserProfileWhereInput[]
    OR?: UserProfileWhereInput[]
    NOT?: UserProfileWhereInput | UserProfileWhereInput[]
    id?: StringFilter<"UserProfile"> | string
    userId?: StringFilter<"UserProfile"> | string
    displayName?: StringFilter<"UserProfile"> | string
    bio?: StringNullableFilter<"UserProfile"> | string | null
    profileImageUrl?: StringNullableFilter<"UserProfile"> | string | null
    headerImageUrl?: StringNullableFilter<"UserProfile"> | string | null
    location?: StringNullableFilter<"UserProfile"> | string | null
    website?: StringNullableFilter<"UserProfile"> | string | null
    personaType?: EnumPersonaTypeFilter<"UserProfile"> | $Enums.PersonaType
    specialtyAreas?: StringNullableListFilter<"UserProfile">
    verificationBadge?: BoolFilter<"UserProfile"> | boolean
    followerCount?: IntFilter<"UserProfile"> | number
    followingCount?: IntFilter<"UserProfile"> | number
    postCount?: IntFilter<"UserProfile"> | number
    createdAt?: DateTimeFilter<"UserProfile"> | Date | string
    updatedAt?: DateTimeFilter<"UserProfile"> | Date | string
    user?: XOR<UserAccountRelationFilter, UserAccountWhereInput>
  }

  export type UserProfileOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    displayName?: SortOrder
    bio?: SortOrderInput | SortOrder
    profileImageUrl?: SortOrderInput | SortOrder
    headerImageUrl?: SortOrderInput | SortOrder
    location?: SortOrderInput | SortOrder
    website?: SortOrderInput | SortOrder
    personaType?: SortOrder
    specialtyAreas?: SortOrder
    verificationBadge?: SortOrder
    followerCount?: SortOrder
    followingCount?: SortOrder
    postCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserAccountOrderByWithRelationInput
  }

  export type UserProfileWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    AND?: UserProfileWhereInput | UserProfileWhereInput[]
    OR?: UserProfileWhereInput[]
    NOT?: UserProfileWhereInput | UserProfileWhereInput[]
    displayName?: StringFilter<"UserProfile"> | string
    bio?: StringNullableFilter<"UserProfile"> | string | null
    profileImageUrl?: StringNullableFilter<"UserProfile"> | string | null
    headerImageUrl?: StringNullableFilter<"UserProfile"> | string | null
    location?: StringNullableFilter<"UserProfile"> | string | null
    website?: StringNullableFilter<"UserProfile"> | string | null
    personaType?: EnumPersonaTypeFilter<"UserProfile"> | $Enums.PersonaType
    specialtyAreas?: StringNullableListFilter<"UserProfile">
    verificationBadge?: BoolFilter<"UserProfile"> | boolean
    followerCount?: IntFilter<"UserProfile"> | number
    followingCount?: IntFilter<"UserProfile"> | number
    postCount?: IntFilter<"UserProfile"> | number
    createdAt?: DateTimeFilter<"UserProfile"> | Date | string
    updatedAt?: DateTimeFilter<"UserProfile"> | Date | string
    user?: XOR<UserAccountRelationFilter, UserAccountWhereInput>
  }, "id" | "userId">

  export type UserProfileOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    displayName?: SortOrder
    bio?: SortOrderInput | SortOrder
    profileImageUrl?: SortOrderInput | SortOrder
    headerImageUrl?: SortOrderInput | SortOrder
    location?: SortOrderInput | SortOrder
    website?: SortOrderInput | SortOrder
    personaType?: SortOrder
    specialtyAreas?: SortOrder
    verificationBadge?: SortOrder
    followerCount?: SortOrder
    followingCount?: SortOrder
    postCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserProfileCountOrderByAggregateInput
    _avg?: UserProfileAvgOrderByAggregateInput
    _max?: UserProfileMaxOrderByAggregateInput
    _min?: UserProfileMinOrderByAggregateInput
    _sum?: UserProfileSumOrderByAggregateInput
  }

  export type UserProfileScalarWhereWithAggregatesInput = {
    AND?: UserProfileScalarWhereWithAggregatesInput | UserProfileScalarWhereWithAggregatesInput[]
    OR?: UserProfileScalarWhereWithAggregatesInput[]
    NOT?: UserProfileScalarWhereWithAggregatesInput | UserProfileScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"UserProfile"> | string
    userId?: StringWithAggregatesFilter<"UserProfile"> | string
    displayName?: StringWithAggregatesFilter<"UserProfile"> | string
    bio?: StringNullableWithAggregatesFilter<"UserProfile"> | string | null
    profileImageUrl?: StringNullableWithAggregatesFilter<"UserProfile"> | string | null
    headerImageUrl?: StringNullableWithAggregatesFilter<"UserProfile"> | string | null
    location?: StringNullableWithAggregatesFilter<"UserProfile"> | string | null
    website?: StringNullableWithAggregatesFilter<"UserProfile"> | string | null
    personaType?: EnumPersonaTypeWithAggregatesFilter<"UserProfile"> | $Enums.PersonaType
    specialtyAreas?: StringNullableListFilter<"UserProfile">
    verificationBadge?: BoolWithAggregatesFilter<"UserProfile"> | boolean
    followerCount?: IntWithAggregatesFilter<"UserProfile"> | number
    followingCount?: IntWithAggregatesFilter<"UserProfile"> | number
    postCount?: IntWithAggregatesFilter<"UserProfile"> | number
    createdAt?: DateTimeWithAggregatesFilter<"UserProfile"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"UserProfile"> | Date | string
  }

  export type PoliticalAlignmentWhereInput = {
    AND?: PoliticalAlignmentWhereInput | PoliticalAlignmentWhereInput[]
    OR?: PoliticalAlignmentWhereInput[]
    NOT?: PoliticalAlignmentWhereInput | PoliticalAlignmentWhereInput[]
    id?: StringFilter<"PoliticalAlignment"> | string
    userId?: StringFilter<"PoliticalAlignment"> | string
    economicPosition?: IntFilter<"PoliticalAlignment"> | number
    socialPosition?: IntFilter<"PoliticalAlignment"> | number
    primaryIssues?: StringNullableListFilter<"PoliticalAlignment">
    partyAffiliation?: StringNullableFilter<"PoliticalAlignment"> | string | null
    ideologyTags?: StringNullableListFilter<"PoliticalAlignment">
    debateWillingness?: IntFilter<"PoliticalAlignment"> | number
    controversyTolerance?: IntFilter<"PoliticalAlignment"> | number
    createdAt?: DateTimeFilter<"PoliticalAlignment"> | Date | string
    updatedAt?: DateTimeFilter<"PoliticalAlignment"> | Date | string
    user?: XOR<UserAccountRelationFilter, UserAccountWhereInput>
    personas?: PersonaListRelationFilter
  }

  export type PoliticalAlignmentOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    economicPosition?: SortOrder
    socialPosition?: SortOrder
    primaryIssues?: SortOrder
    partyAffiliation?: SortOrderInput | SortOrder
    ideologyTags?: SortOrder
    debateWillingness?: SortOrder
    controversyTolerance?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserAccountOrderByWithRelationInput
    personas?: PersonaOrderByRelationAggregateInput
  }

  export type PoliticalAlignmentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    AND?: PoliticalAlignmentWhereInput | PoliticalAlignmentWhereInput[]
    OR?: PoliticalAlignmentWhereInput[]
    NOT?: PoliticalAlignmentWhereInput | PoliticalAlignmentWhereInput[]
    economicPosition?: IntFilter<"PoliticalAlignment"> | number
    socialPosition?: IntFilter<"PoliticalAlignment"> | number
    primaryIssues?: StringNullableListFilter<"PoliticalAlignment">
    partyAffiliation?: StringNullableFilter<"PoliticalAlignment"> | string | null
    ideologyTags?: StringNullableListFilter<"PoliticalAlignment">
    debateWillingness?: IntFilter<"PoliticalAlignment"> | number
    controversyTolerance?: IntFilter<"PoliticalAlignment"> | number
    createdAt?: DateTimeFilter<"PoliticalAlignment"> | Date | string
    updatedAt?: DateTimeFilter<"PoliticalAlignment"> | Date | string
    user?: XOR<UserAccountRelationFilter, UserAccountWhereInput>
    personas?: PersonaListRelationFilter
  }, "id" | "userId">

  export type PoliticalAlignmentOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    economicPosition?: SortOrder
    socialPosition?: SortOrder
    primaryIssues?: SortOrder
    partyAffiliation?: SortOrderInput | SortOrder
    ideologyTags?: SortOrder
    debateWillingness?: SortOrder
    controversyTolerance?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PoliticalAlignmentCountOrderByAggregateInput
    _avg?: PoliticalAlignmentAvgOrderByAggregateInput
    _max?: PoliticalAlignmentMaxOrderByAggregateInput
    _min?: PoliticalAlignmentMinOrderByAggregateInput
    _sum?: PoliticalAlignmentSumOrderByAggregateInput
  }

  export type PoliticalAlignmentScalarWhereWithAggregatesInput = {
    AND?: PoliticalAlignmentScalarWhereWithAggregatesInput | PoliticalAlignmentScalarWhereWithAggregatesInput[]
    OR?: PoliticalAlignmentScalarWhereWithAggregatesInput[]
    NOT?: PoliticalAlignmentScalarWhereWithAggregatesInput | PoliticalAlignmentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PoliticalAlignment"> | string
    userId?: StringWithAggregatesFilter<"PoliticalAlignment"> | string
    economicPosition?: IntWithAggregatesFilter<"PoliticalAlignment"> | number
    socialPosition?: IntWithAggregatesFilter<"PoliticalAlignment"> | number
    primaryIssues?: StringNullableListFilter<"PoliticalAlignment">
    partyAffiliation?: StringNullableWithAggregatesFilter<"PoliticalAlignment"> | string | null
    ideologyTags?: StringNullableListFilter<"PoliticalAlignment">
    debateWillingness?: IntWithAggregatesFilter<"PoliticalAlignment"> | number
    controversyTolerance?: IntWithAggregatesFilter<"PoliticalAlignment"> | number
    createdAt?: DateTimeWithAggregatesFilter<"PoliticalAlignment"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"PoliticalAlignment"> | Date | string
  }

  export type InfluenceMetricsWhereInput = {
    AND?: InfluenceMetricsWhereInput | InfluenceMetricsWhereInput[]
    OR?: InfluenceMetricsWhereInput[]
    NOT?: InfluenceMetricsWhereInput | InfluenceMetricsWhereInput[]
    id?: StringFilter<"InfluenceMetrics"> | string
    userId?: StringFilter<"InfluenceMetrics"> | string
    followerCount?: IntFilter<"InfluenceMetrics"> | number
    followingCount?: IntFilter<"InfluenceMetrics"> | number
    engagementRate?: FloatFilter<"InfluenceMetrics"> | number
    reachScore?: IntFilter<"InfluenceMetrics"> | number
    approvalRating?: IntFilter<"InfluenceMetrics"> | number
    controversyLevel?: IntFilter<"InfluenceMetrics"> | number
    trendingScore?: IntFilter<"InfluenceMetrics"> | number
    followerGrowthDaily?: IntFilter<"InfluenceMetrics"> | number
    followerGrowthWeekly?: IntFilter<"InfluenceMetrics"> | number
    followerGrowthMonthly?: IntFilter<"InfluenceMetrics"> | number
    totalLikes?: IntFilter<"InfluenceMetrics"> | number
    totalReshares?: IntFilter<"InfluenceMetrics"> | number
    totalComments?: IntFilter<"InfluenceMetrics"> | number
    influenceRank?: IntFilter<"InfluenceMetrics"> | number
    categoryRank?: IntFilter<"InfluenceMetrics"> | number
    lastUpdated?: DateTimeFilter<"InfluenceMetrics"> | Date | string
    createdAt?: DateTimeFilter<"InfluenceMetrics"> | Date | string
    user?: XOR<UserAccountRelationFilter, UserAccountWhereInput>
  }

  export type InfluenceMetricsOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    followerCount?: SortOrder
    followingCount?: SortOrder
    engagementRate?: SortOrder
    reachScore?: SortOrder
    approvalRating?: SortOrder
    controversyLevel?: SortOrder
    trendingScore?: SortOrder
    followerGrowthDaily?: SortOrder
    followerGrowthWeekly?: SortOrder
    followerGrowthMonthly?: SortOrder
    totalLikes?: SortOrder
    totalReshares?: SortOrder
    totalComments?: SortOrder
    influenceRank?: SortOrder
    categoryRank?: SortOrder
    lastUpdated?: SortOrder
    createdAt?: SortOrder
    user?: UserAccountOrderByWithRelationInput
  }

  export type InfluenceMetricsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    AND?: InfluenceMetricsWhereInput | InfluenceMetricsWhereInput[]
    OR?: InfluenceMetricsWhereInput[]
    NOT?: InfluenceMetricsWhereInput | InfluenceMetricsWhereInput[]
    followerCount?: IntFilter<"InfluenceMetrics"> | number
    followingCount?: IntFilter<"InfluenceMetrics"> | number
    engagementRate?: FloatFilter<"InfluenceMetrics"> | number
    reachScore?: IntFilter<"InfluenceMetrics"> | number
    approvalRating?: IntFilter<"InfluenceMetrics"> | number
    controversyLevel?: IntFilter<"InfluenceMetrics"> | number
    trendingScore?: IntFilter<"InfluenceMetrics"> | number
    followerGrowthDaily?: IntFilter<"InfluenceMetrics"> | number
    followerGrowthWeekly?: IntFilter<"InfluenceMetrics"> | number
    followerGrowthMonthly?: IntFilter<"InfluenceMetrics"> | number
    totalLikes?: IntFilter<"InfluenceMetrics"> | number
    totalReshares?: IntFilter<"InfluenceMetrics"> | number
    totalComments?: IntFilter<"InfluenceMetrics"> | number
    influenceRank?: IntFilter<"InfluenceMetrics"> | number
    categoryRank?: IntFilter<"InfluenceMetrics"> | number
    lastUpdated?: DateTimeFilter<"InfluenceMetrics"> | Date | string
    createdAt?: DateTimeFilter<"InfluenceMetrics"> | Date | string
    user?: XOR<UserAccountRelationFilter, UserAccountWhereInput>
  }, "id" | "userId">

  export type InfluenceMetricsOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    followerCount?: SortOrder
    followingCount?: SortOrder
    engagementRate?: SortOrder
    reachScore?: SortOrder
    approvalRating?: SortOrder
    controversyLevel?: SortOrder
    trendingScore?: SortOrder
    followerGrowthDaily?: SortOrder
    followerGrowthWeekly?: SortOrder
    followerGrowthMonthly?: SortOrder
    totalLikes?: SortOrder
    totalReshares?: SortOrder
    totalComments?: SortOrder
    influenceRank?: SortOrder
    categoryRank?: SortOrder
    lastUpdated?: SortOrder
    createdAt?: SortOrder
    _count?: InfluenceMetricsCountOrderByAggregateInput
    _avg?: InfluenceMetricsAvgOrderByAggregateInput
    _max?: InfluenceMetricsMaxOrderByAggregateInput
    _min?: InfluenceMetricsMinOrderByAggregateInput
    _sum?: InfluenceMetricsSumOrderByAggregateInput
  }

  export type InfluenceMetricsScalarWhereWithAggregatesInput = {
    AND?: InfluenceMetricsScalarWhereWithAggregatesInput | InfluenceMetricsScalarWhereWithAggregatesInput[]
    OR?: InfluenceMetricsScalarWhereWithAggregatesInput[]
    NOT?: InfluenceMetricsScalarWhereWithAggregatesInput | InfluenceMetricsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"InfluenceMetrics"> | string
    userId?: StringWithAggregatesFilter<"InfluenceMetrics"> | string
    followerCount?: IntWithAggregatesFilter<"InfluenceMetrics"> | number
    followingCount?: IntWithAggregatesFilter<"InfluenceMetrics"> | number
    engagementRate?: FloatWithAggregatesFilter<"InfluenceMetrics"> | number
    reachScore?: IntWithAggregatesFilter<"InfluenceMetrics"> | number
    approvalRating?: IntWithAggregatesFilter<"InfluenceMetrics"> | number
    controversyLevel?: IntWithAggregatesFilter<"InfluenceMetrics"> | number
    trendingScore?: IntWithAggregatesFilter<"InfluenceMetrics"> | number
    followerGrowthDaily?: IntWithAggregatesFilter<"InfluenceMetrics"> | number
    followerGrowthWeekly?: IntWithAggregatesFilter<"InfluenceMetrics"> | number
    followerGrowthMonthly?: IntWithAggregatesFilter<"InfluenceMetrics"> | number
    totalLikes?: IntWithAggregatesFilter<"InfluenceMetrics"> | number
    totalReshares?: IntWithAggregatesFilter<"InfluenceMetrics"> | number
    totalComments?: IntWithAggregatesFilter<"InfluenceMetrics"> | number
    influenceRank?: IntWithAggregatesFilter<"InfluenceMetrics"> | number
    categoryRank?: IntWithAggregatesFilter<"InfluenceMetrics"> | number
    lastUpdated?: DateTimeWithAggregatesFilter<"InfluenceMetrics"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"InfluenceMetrics"> | Date | string
  }

  export type SettingsWhereInput = {
    AND?: SettingsWhereInput | SettingsWhereInput[]
    OR?: SettingsWhereInput[]
    NOT?: SettingsWhereInput | SettingsWhereInput[]
    id?: StringFilter<"Settings"> | string
    userId?: StringFilter<"Settings"> | string
    newsRegion?: StringFilter<"Settings"> | string
    newsCategories?: EnumNewsCategoryNullableListFilter<"Settings">
    newsLanguages?: StringNullableListFilter<"Settings">
    aiChatterLevel?: IntFilter<"Settings"> | number
    aiPersonalities?: StringNullableListFilter<"Settings">
    aiResponseTone?: EnumToneStyleFilter<"Settings"> | $Enums.ToneStyle
    emailNotifications?: BoolFilter<"Settings"> | boolean
    pushNotifications?: BoolFilter<"Settings"> | boolean
    notificationCategories?: EnumNotificationCategoryNullableListFilter<"Settings">
    profileVisibility?: EnumProfileVisibilityFilter<"Settings"> | $Enums.ProfileVisibility
    allowPersonaInteractions?: BoolFilter<"Settings"> | boolean
    allowDataForAI?: BoolFilter<"Settings"> | boolean
    theme?: EnumThemeFilter<"Settings"> | $Enums.Theme
    language?: StringFilter<"Settings"> | string
    timezone?: StringFilter<"Settings"> | string
    customAIApiKey?: StringNullableFilter<"Settings"> | string | null
    customAIBaseUrl?: StringNullableFilter<"Settings"> | string | null
    createdAt?: DateTimeFilter<"Settings"> | Date | string
    updatedAt?: DateTimeFilter<"Settings"> | Date | string
    user?: XOR<UserAccountRelationFilter, UserAccountWhereInput>
  }

  export type SettingsOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    newsRegion?: SortOrder
    newsCategories?: SortOrder
    newsLanguages?: SortOrder
    aiChatterLevel?: SortOrder
    aiPersonalities?: SortOrder
    aiResponseTone?: SortOrder
    emailNotifications?: SortOrder
    pushNotifications?: SortOrder
    notificationCategories?: SortOrder
    profileVisibility?: SortOrder
    allowPersonaInteractions?: SortOrder
    allowDataForAI?: SortOrder
    theme?: SortOrder
    language?: SortOrder
    timezone?: SortOrder
    customAIApiKey?: SortOrderInput | SortOrder
    customAIBaseUrl?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserAccountOrderByWithRelationInput
  }

  export type SettingsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    AND?: SettingsWhereInput | SettingsWhereInput[]
    OR?: SettingsWhereInput[]
    NOT?: SettingsWhereInput | SettingsWhereInput[]
    newsRegion?: StringFilter<"Settings"> | string
    newsCategories?: EnumNewsCategoryNullableListFilter<"Settings">
    newsLanguages?: StringNullableListFilter<"Settings">
    aiChatterLevel?: IntFilter<"Settings"> | number
    aiPersonalities?: StringNullableListFilter<"Settings">
    aiResponseTone?: EnumToneStyleFilter<"Settings"> | $Enums.ToneStyle
    emailNotifications?: BoolFilter<"Settings"> | boolean
    pushNotifications?: BoolFilter<"Settings"> | boolean
    notificationCategories?: EnumNotificationCategoryNullableListFilter<"Settings">
    profileVisibility?: EnumProfileVisibilityFilter<"Settings"> | $Enums.ProfileVisibility
    allowPersonaInteractions?: BoolFilter<"Settings"> | boolean
    allowDataForAI?: BoolFilter<"Settings"> | boolean
    theme?: EnumThemeFilter<"Settings"> | $Enums.Theme
    language?: StringFilter<"Settings"> | string
    timezone?: StringFilter<"Settings"> | string
    customAIApiKey?: StringNullableFilter<"Settings"> | string | null
    customAIBaseUrl?: StringNullableFilter<"Settings"> | string | null
    createdAt?: DateTimeFilter<"Settings"> | Date | string
    updatedAt?: DateTimeFilter<"Settings"> | Date | string
    user?: XOR<UserAccountRelationFilter, UserAccountWhereInput>
  }, "id" | "userId">

  export type SettingsOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    newsRegion?: SortOrder
    newsCategories?: SortOrder
    newsLanguages?: SortOrder
    aiChatterLevel?: SortOrder
    aiPersonalities?: SortOrder
    aiResponseTone?: SortOrder
    emailNotifications?: SortOrder
    pushNotifications?: SortOrder
    notificationCategories?: SortOrder
    profileVisibility?: SortOrder
    allowPersonaInteractions?: SortOrder
    allowDataForAI?: SortOrder
    theme?: SortOrder
    language?: SortOrder
    timezone?: SortOrder
    customAIApiKey?: SortOrderInput | SortOrder
    customAIBaseUrl?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SettingsCountOrderByAggregateInput
    _avg?: SettingsAvgOrderByAggregateInput
    _max?: SettingsMaxOrderByAggregateInput
    _min?: SettingsMinOrderByAggregateInput
    _sum?: SettingsSumOrderByAggregateInput
  }

  export type SettingsScalarWhereWithAggregatesInput = {
    AND?: SettingsScalarWhereWithAggregatesInput | SettingsScalarWhereWithAggregatesInput[]
    OR?: SettingsScalarWhereWithAggregatesInput[]
    NOT?: SettingsScalarWhereWithAggregatesInput | SettingsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Settings"> | string
    userId?: StringWithAggregatesFilter<"Settings"> | string
    newsRegion?: StringWithAggregatesFilter<"Settings"> | string
    newsCategories?: EnumNewsCategoryNullableListFilter<"Settings">
    newsLanguages?: StringNullableListFilter<"Settings">
    aiChatterLevel?: IntWithAggregatesFilter<"Settings"> | number
    aiPersonalities?: StringNullableListFilter<"Settings">
    aiResponseTone?: EnumToneStyleWithAggregatesFilter<"Settings"> | $Enums.ToneStyle
    emailNotifications?: BoolWithAggregatesFilter<"Settings"> | boolean
    pushNotifications?: BoolWithAggregatesFilter<"Settings"> | boolean
    notificationCategories?: EnumNotificationCategoryNullableListFilter<"Settings">
    profileVisibility?: EnumProfileVisibilityWithAggregatesFilter<"Settings"> | $Enums.ProfileVisibility
    allowPersonaInteractions?: BoolWithAggregatesFilter<"Settings"> | boolean
    allowDataForAI?: BoolWithAggregatesFilter<"Settings"> | boolean
    theme?: EnumThemeWithAggregatesFilter<"Settings"> | $Enums.Theme
    language?: StringWithAggregatesFilter<"Settings"> | string
    timezone?: StringWithAggregatesFilter<"Settings"> | string
    customAIApiKey?: StringNullableWithAggregatesFilter<"Settings"> | string | null
    customAIBaseUrl?: StringNullableWithAggregatesFilter<"Settings"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Settings"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Settings"> | Date | string
  }

  export type PostWhereInput = {
    AND?: PostWhereInput | PostWhereInput[]
    OR?: PostWhereInput[]
    NOT?: PostWhereInput | PostWhereInput[]
    id?: StringFilter<"Post"> | string
    authorId?: StringFilter<"Post"> | string
    personaId?: StringNullableFilter<"Post"> | string | null
    content?: StringFilter<"Post"> | string
    mediaUrls?: StringNullableListFilter<"Post">
    linkPreview?: JsonNullableFilter<"Post">
    threadId?: StringFilter<"Post"> | string
    parentPostId?: StringNullableFilter<"Post"> | string | null
    repostOfId?: StringNullableFilter<"Post"> | string | null
    isAIGenerated?: BoolFilter<"Post"> | boolean
    hashtags?: StringNullableListFilter<"Post">
    mentions?: StringNullableListFilter<"Post">
    newsItemId?: StringNullableFilter<"Post"> | string | null
    newsContext?: StringNullableFilter<"Post"> | string | null
    likeCount?: IntFilter<"Post"> | number
    repostCount?: IntFilter<"Post"> | number
    commentCount?: IntFilter<"Post"> | number
    impressionCount?: IntFilter<"Post"> | number
    contentWarning?: StringNullableFilter<"Post"> | string | null
    isHidden?: BoolFilter<"Post"> | boolean
    reportCount?: IntFilter<"Post"> | number
    publishedAt?: DateTimeFilter<"Post"> | Date | string
    editedAt?: DateTimeNullableFilter<"Post"> | Date | string | null
    createdAt?: DateTimeFilter<"Post"> | Date | string
    updatedAt?: DateTimeFilter<"Post"> | Date | string
    author?: XOR<UserAccountRelationFilter, UserAccountWhereInput>
    persona?: XOR<PersonaNullableRelationFilter, PersonaWhereInput> | null
    thread?: XOR<ThreadRelationFilter, ThreadWhereInput>
    parentPost?: XOR<PostNullableRelationFilter, PostWhereInput> | null
    repostOf?: XOR<PostNullableRelationFilter, PostWhereInput> | null
    newsItem?: XOR<NewsItemNullableRelationFilter, NewsItemWhereInput> | null
    replies?: PostListRelationFilter
    reposts?: PostListRelationFilter
    reactions?: ReactionListRelationFilter
  }

  export type PostOrderByWithRelationInput = {
    id?: SortOrder
    authorId?: SortOrder
    personaId?: SortOrderInput | SortOrder
    content?: SortOrder
    mediaUrls?: SortOrder
    linkPreview?: SortOrderInput | SortOrder
    threadId?: SortOrder
    parentPostId?: SortOrderInput | SortOrder
    repostOfId?: SortOrderInput | SortOrder
    isAIGenerated?: SortOrder
    hashtags?: SortOrder
    mentions?: SortOrder
    newsItemId?: SortOrderInput | SortOrder
    newsContext?: SortOrderInput | SortOrder
    likeCount?: SortOrder
    repostCount?: SortOrder
    commentCount?: SortOrder
    impressionCount?: SortOrder
    contentWarning?: SortOrderInput | SortOrder
    isHidden?: SortOrder
    reportCount?: SortOrder
    publishedAt?: SortOrder
    editedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    author?: UserAccountOrderByWithRelationInput
    persona?: PersonaOrderByWithRelationInput
    thread?: ThreadOrderByWithRelationInput
    parentPost?: PostOrderByWithRelationInput
    repostOf?: PostOrderByWithRelationInput
    newsItem?: NewsItemOrderByWithRelationInput
    replies?: PostOrderByRelationAggregateInput
    reposts?: PostOrderByRelationAggregateInput
    reactions?: ReactionOrderByRelationAggregateInput
  }

  export type PostWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PostWhereInput | PostWhereInput[]
    OR?: PostWhereInput[]
    NOT?: PostWhereInput | PostWhereInput[]
    authorId?: StringFilter<"Post"> | string
    personaId?: StringNullableFilter<"Post"> | string | null
    content?: StringFilter<"Post"> | string
    mediaUrls?: StringNullableListFilter<"Post">
    linkPreview?: JsonNullableFilter<"Post">
    threadId?: StringFilter<"Post"> | string
    parentPostId?: StringNullableFilter<"Post"> | string | null
    repostOfId?: StringNullableFilter<"Post"> | string | null
    isAIGenerated?: BoolFilter<"Post"> | boolean
    hashtags?: StringNullableListFilter<"Post">
    mentions?: StringNullableListFilter<"Post">
    newsItemId?: StringNullableFilter<"Post"> | string | null
    newsContext?: StringNullableFilter<"Post"> | string | null
    likeCount?: IntFilter<"Post"> | number
    repostCount?: IntFilter<"Post"> | number
    commentCount?: IntFilter<"Post"> | number
    impressionCount?: IntFilter<"Post"> | number
    contentWarning?: StringNullableFilter<"Post"> | string | null
    isHidden?: BoolFilter<"Post"> | boolean
    reportCount?: IntFilter<"Post"> | number
    publishedAt?: DateTimeFilter<"Post"> | Date | string
    editedAt?: DateTimeNullableFilter<"Post"> | Date | string | null
    createdAt?: DateTimeFilter<"Post"> | Date | string
    updatedAt?: DateTimeFilter<"Post"> | Date | string
    author?: XOR<UserAccountRelationFilter, UserAccountWhereInput>
    persona?: XOR<PersonaNullableRelationFilter, PersonaWhereInput> | null
    thread?: XOR<ThreadRelationFilter, ThreadWhereInput>
    parentPost?: XOR<PostNullableRelationFilter, PostWhereInput> | null
    repostOf?: XOR<PostNullableRelationFilter, PostWhereInput> | null
    newsItem?: XOR<NewsItemNullableRelationFilter, NewsItemWhereInput> | null
    replies?: PostListRelationFilter
    reposts?: PostListRelationFilter
    reactions?: ReactionListRelationFilter
  }, "id">

  export type PostOrderByWithAggregationInput = {
    id?: SortOrder
    authorId?: SortOrder
    personaId?: SortOrderInput | SortOrder
    content?: SortOrder
    mediaUrls?: SortOrder
    linkPreview?: SortOrderInput | SortOrder
    threadId?: SortOrder
    parentPostId?: SortOrderInput | SortOrder
    repostOfId?: SortOrderInput | SortOrder
    isAIGenerated?: SortOrder
    hashtags?: SortOrder
    mentions?: SortOrder
    newsItemId?: SortOrderInput | SortOrder
    newsContext?: SortOrderInput | SortOrder
    likeCount?: SortOrder
    repostCount?: SortOrder
    commentCount?: SortOrder
    impressionCount?: SortOrder
    contentWarning?: SortOrderInput | SortOrder
    isHidden?: SortOrder
    reportCount?: SortOrder
    publishedAt?: SortOrder
    editedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PostCountOrderByAggregateInput
    _avg?: PostAvgOrderByAggregateInput
    _max?: PostMaxOrderByAggregateInput
    _min?: PostMinOrderByAggregateInput
    _sum?: PostSumOrderByAggregateInput
  }

  export type PostScalarWhereWithAggregatesInput = {
    AND?: PostScalarWhereWithAggregatesInput | PostScalarWhereWithAggregatesInput[]
    OR?: PostScalarWhereWithAggregatesInput[]
    NOT?: PostScalarWhereWithAggregatesInput | PostScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Post"> | string
    authorId?: StringWithAggregatesFilter<"Post"> | string
    personaId?: StringNullableWithAggregatesFilter<"Post"> | string | null
    content?: StringWithAggregatesFilter<"Post"> | string
    mediaUrls?: StringNullableListFilter<"Post">
    linkPreview?: JsonNullableWithAggregatesFilter<"Post">
    threadId?: StringWithAggregatesFilter<"Post"> | string
    parentPostId?: StringNullableWithAggregatesFilter<"Post"> | string | null
    repostOfId?: StringNullableWithAggregatesFilter<"Post"> | string | null
    isAIGenerated?: BoolWithAggregatesFilter<"Post"> | boolean
    hashtags?: StringNullableListFilter<"Post">
    mentions?: StringNullableListFilter<"Post">
    newsItemId?: StringNullableWithAggregatesFilter<"Post"> | string | null
    newsContext?: StringNullableWithAggregatesFilter<"Post"> | string | null
    likeCount?: IntWithAggregatesFilter<"Post"> | number
    repostCount?: IntWithAggregatesFilter<"Post"> | number
    commentCount?: IntWithAggregatesFilter<"Post"> | number
    impressionCount?: IntWithAggregatesFilter<"Post"> | number
    contentWarning?: StringNullableWithAggregatesFilter<"Post"> | string | null
    isHidden?: BoolWithAggregatesFilter<"Post"> | boolean
    reportCount?: IntWithAggregatesFilter<"Post"> | number
    publishedAt?: DateTimeWithAggregatesFilter<"Post"> | Date | string
    editedAt?: DateTimeNullableWithAggregatesFilter<"Post"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Post"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Post"> | Date | string
  }

  export type ThreadWhereInput = {
    AND?: ThreadWhereInput | ThreadWhereInput[]
    OR?: ThreadWhereInput[]
    NOT?: ThreadWhereInput | ThreadWhereInput[]
    id?: StringFilter<"Thread"> | string
    originalPostId?: StringFilter<"Thread"> | string
    title?: StringNullableFilter<"Thread"> | string | null
    participantCount?: IntFilter<"Thread"> | number
    postCount?: IntFilter<"Thread"> | number
    maxDepth?: IntFilter<"Thread"> | number
    totalLikes?: IntFilter<"Thread"> | number
    totalReshares?: IntFilter<"Thread"> | number
    lastActivityAt?: DateTimeFilter<"Thread"> | Date | string
    isLocked?: BoolFilter<"Thread"> | boolean
    isHidden?: BoolFilter<"Thread"> | boolean
    createdAt?: DateTimeFilter<"Thread"> | Date | string
    updatedAt?: DateTimeFilter<"Thread"> | Date | string
    posts?: PostListRelationFilter
  }

  export type ThreadOrderByWithRelationInput = {
    id?: SortOrder
    originalPostId?: SortOrder
    title?: SortOrderInput | SortOrder
    participantCount?: SortOrder
    postCount?: SortOrder
    maxDepth?: SortOrder
    totalLikes?: SortOrder
    totalReshares?: SortOrder
    lastActivityAt?: SortOrder
    isLocked?: SortOrder
    isHidden?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    posts?: PostOrderByRelationAggregateInput
  }

  export type ThreadWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    originalPostId?: string
    AND?: ThreadWhereInput | ThreadWhereInput[]
    OR?: ThreadWhereInput[]
    NOT?: ThreadWhereInput | ThreadWhereInput[]
    title?: StringNullableFilter<"Thread"> | string | null
    participantCount?: IntFilter<"Thread"> | number
    postCount?: IntFilter<"Thread"> | number
    maxDepth?: IntFilter<"Thread"> | number
    totalLikes?: IntFilter<"Thread"> | number
    totalReshares?: IntFilter<"Thread"> | number
    lastActivityAt?: DateTimeFilter<"Thread"> | Date | string
    isLocked?: BoolFilter<"Thread"> | boolean
    isHidden?: BoolFilter<"Thread"> | boolean
    createdAt?: DateTimeFilter<"Thread"> | Date | string
    updatedAt?: DateTimeFilter<"Thread"> | Date | string
    posts?: PostListRelationFilter
  }, "id" | "originalPostId">

  export type ThreadOrderByWithAggregationInput = {
    id?: SortOrder
    originalPostId?: SortOrder
    title?: SortOrderInput | SortOrder
    participantCount?: SortOrder
    postCount?: SortOrder
    maxDepth?: SortOrder
    totalLikes?: SortOrder
    totalReshares?: SortOrder
    lastActivityAt?: SortOrder
    isLocked?: SortOrder
    isHidden?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ThreadCountOrderByAggregateInput
    _avg?: ThreadAvgOrderByAggregateInput
    _max?: ThreadMaxOrderByAggregateInput
    _min?: ThreadMinOrderByAggregateInput
    _sum?: ThreadSumOrderByAggregateInput
  }

  export type ThreadScalarWhereWithAggregatesInput = {
    AND?: ThreadScalarWhereWithAggregatesInput | ThreadScalarWhereWithAggregatesInput[]
    OR?: ThreadScalarWhereWithAggregatesInput[]
    NOT?: ThreadScalarWhereWithAggregatesInput | ThreadScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Thread"> | string
    originalPostId?: StringWithAggregatesFilter<"Thread"> | string
    title?: StringNullableWithAggregatesFilter<"Thread"> | string | null
    participantCount?: IntWithAggregatesFilter<"Thread"> | number
    postCount?: IntWithAggregatesFilter<"Thread"> | number
    maxDepth?: IntWithAggregatesFilter<"Thread"> | number
    totalLikes?: IntWithAggregatesFilter<"Thread"> | number
    totalReshares?: IntWithAggregatesFilter<"Thread"> | number
    lastActivityAt?: DateTimeWithAggregatesFilter<"Thread"> | Date | string
    isLocked?: BoolWithAggregatesFilter<"Thread"> | boolean
    isHidden?: BoolWithAggregatesFilter<"Thread"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Thread"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Thread"> | Date | string
  }

  export type ReactionWhereInput = {
    AND?: ReactionWhereInput | ReactionWhereInput[]
    OR?: ReactionWhereInput[]
    NOT?: ReactionWhereInput | ReactionWhereInput[]
    id?: StringFilter<"Reaction"> | string
    userId?: StringFilter<"Reaction"> | string
    postId?: StringFilter<"Reaction"> | string
    type?: EnumReactionTypeFilter<"Reaction"> | $Enums.ReactionType
    createdAt?: DateTimeFilter<"Reaction"> | Date | string
    user?: XOR<UserAccountRelationFilter, UserAccountWhereInput>
    post?: XOR<PostRelationFilter, PostWhereInput>
  }

  export type ReactionOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    postId?: SortOrder
    type?: SortOrder
    createdAt?: SortOrder
    user?: UserAccountOrderByWithRelationInput
    post?: PostOrderByWithRelationInput
  }

  export type ReactionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    unique_user_post_reaction?: ReactionUnique_user_post_reactionCompoundUniqueInput
    AND?: ReactionWhereInput | ReactionWhereInput[]
    OR?: ReactionWhereInput[]
    NOT?: ReactionWhereInput | ReactionWhereInput[]
    userId?: StringFilter<"Reaction"> | string
    postId?: StringFilter<"Reaction"> | string
    type?: EnumReactionTypeFilter<"Reaction"> | $Enums.ReactionType
    createdAt?: DateTimeFilter<"Reaction"> | Date | string
    user?: XOR<UserAccountRelationFilter, UserAccountWhereInput>
    post?: XOR<PostRelationFilter, PostWhereInput>
  }, "id" | "unique_user_post_reaction">

  export type ReactionOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    postId?: SortOrder
    type?: SortOrder
    createdAt?: SortOrder
    _count?: ReactionCountOrderByAggregateInput
    _max?: ReactionMaxOrderByAggregateInput
    _min?: ReactionMinOrderByAggregateInput
  }

  export type ReactionScalarWhereWithAggregatesInput = {
    AND?: ReactionScalarWhereWithAggregatesInput | ReactionScalarWhereWithAggregatesInput[]
    OR?: ReactionScalarWhereWithAggregatesInput[]
    NOT?: ReactionScalarWhereWithAggregatesInput | ReactionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Reaction"> | string
    userId?: StringWithAggregatesFilter<"Reaction"> | string
    postId?: StringWithAggregatesFilter<"Reaction"> | string
    type?: EnumReactionTypeWithAggregatesFilter<"Reaction"> | $Enums.ReactionType
    createdAt?: DateTimeWithAggregatesFilter<"Reaction"> | Date | string
  }

  export type PersonaWhereInput = {
    AND?: PersonaWhereInput | PersonaWhereInput[]
    OR?: PersonaWhereInput[]
    NOT?: PersonaWhereInput | PersonaWhereInput[]
    id?: StringFilter<"Persona"> | string
    name?: StringFilter<"Persona"> | string
    handle?: StringFilter<"Persona"> | string
    bio?: StringFilter<"Persona"> | string
    profileImageUrl?: StringFilter<"Persona"> | string
    personaType?: EnumPersonaTypeFilter<"Persona"> | $Enums.PersonaType
    personalityTraits?: StringNullableListFilter<"Persona">
    interests?: StringNullableListFilter<"Persona">
    expertise?: StringNullableListFilter<"Persona">
    toneStyle?: EnumToneStyleFilter<"Persona"> | $Enums.ToneStyle
    controversyTolerance?: IntFilter<"Persona"> | number
    engagementFrequency?: IntFilter<"Persona"> | number
    debateAggression?: IntFilter<"Persona"> | number
    politicalAlignmentId?: StringFilter<"Persona"> | string
    aiProvider?: StringFilter<"Persona"> | string
    systemPrompt?: StringFilter<"Persona"> | string
    contextWindow?: IntFilter<"Persona"> | number
    postingSchedule?: JsonFilter<"Persona">
    timezonePreference?: StringFilter<"Persona"> | string
    isActive?: BoolFilter<"Persona"> | boolean
    isDefault?: BoolFilter<"Persona"> | boolean
    createdAt?: DateTimeFilter<"Persona"> | Date | string
    updatedAt?: DateTimeFilter<"Persona"> | Date | string
    politicalAlignment?: XOR<PoliticalAlignmentRelationFilter, PoliticalAlignmentWhereInput>
    posts?: PostListRelationFilter
  }

  export type PersonaOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    handle?: SortOrder
    bio?: SortOrder
    profileImageUrl?: SortOrder
    personaType?: SortOrder
    personalityTraits?: SortOrder
    interests?: SortOrder
    expertise?: SortOrder
    toneStyle?: SortOrder
    controversyTolerance?: SortOrder
    engagementFrequency?: SortOrder
    debateAggression?: SortOrder
    politicalAlignmentId?: SortOrder
    aiProvider?: SortOrder
    systemPrompt?: SortOrder
    contextWindow?: SortOrder
    postingSchedule?: SortOrder
    timezonePreference?: SortOrder
    isActive?: SortOrder
    isDefault?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    politicalAlignment?: PoliticalAlignmentOrderByWithRelationInput
    posts?: PostOrderByRelationAggregateInput
  }

  export type PersonaWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    handle?: string
    AND?: PersonaWhereInput | PersonaWhereInput[]
    OR?: PersonaWhereInput[]
    NOT?: PersonaWhereInput | PersonaWhereInput[]
    name?: StringFilter<"Persona"> | string
    bio?: StringFilter<"Persona"> | string
    profileImageUrl?: StringFilter<"Persona"> | string
    personaType?: EnumPersonaTypeFilter<"Persona"> | $Enums.PersonaType
    personalityTraits?: StringNullableListFilter<"Persona">
    interests?: StringNullableListFilter<"Persona">
    expertise?: StringNullableListFilter<"Persona">
    toneStyle?: EnumToneStyleFilter<"Persona"> | $Enums.ToneStyle
    controversyTolerance?: IntFilter<"Persona"> | number
    engagementFrequency?: IntFilter<"Persona"> | number
    debateAggression?: IntFilter<"Persona"> | number
    politicalAlignmentId?: StringFilter<"Persona"> | string
    aiProvider?: StringFilter<"Persona"> | string
    systemPrompt?: StringFilter<"Persona"> | string
    contextWindow?: IntFilter<"Persona"> | number
    postingSchedule?: JsonFilter<"Persona">
    timezonePreference?: StringFilter<"Persona"> | string
    isActive?: BoolFilter<"Persona"> | boolean
    isDefault?: BoolFilter<"Persona"> | boolean
    createdAt?: DateTimeFilter<"Persona"> | Date | string
    updatedAt?: DateTimeFilter<"Persona"> | Date | string
    politicalAlignment?: XOR<PoliticalAlignmentRelationFilter, PoliticalAlignmentWhereInput>
    posts?: PostListRelationFilter
  }, "id" | "handle">

  export type PersonaOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    handle?: SortOrder
    bio?: SortOrder
    profileImageUrl?: SortOrder
    personaType?: SortOrder
    personalityTraits?: SortOrder
    interests?: SortOrder
    expertise?: SortOrder
    toneStyle?: SortOrder
    controversyTolerance?: SortOrder
    engagementFrequency?: SortOrder
    debateAggression?: SortOrder
    politicalAlignmentId?: SortOrder
    aiProvider?: SortOrder
    systemPrompt?: SortOrder
    contextWindow?: SortOrder
    postingSchedule?: SortOrder
    timezonePreference?: SortOrder
    isActive?: SortOrder
    isDefault?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PersonaCountOrderByAggregateInput
    _avg?: PersonaAvgOrderByAggregateInput
    _max?: PersonaMaxOrderByAggregateInput
    _min?: PersonaMinOrderByAggregateInput
    _sum?: PersonaSumOrderByAggregateInput
  }

  export type PersonaScalarWhereWithAggregatesInput = {
    AND?: PersonaScalarWhereWithAggregatesInput | PersonaScalarWhereWithAggregatesInput[]
    OR?: PersonaScalarWhereWithAggregatesInput[]
    NOT?: PersonaScalarWhereWithAggregatesInput | PersonaScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Persona"> | string
    name?: StringWithAggregatesFilter<"Persona"> | string
    handle?: StringWithAggregatesFilter<"Persona"> | string
    bio?: StringWithAggregatesFilter<"Persona"> | string
    profileImageUrl?: StringWithAggregatesFilter<"Persona"> | string
    personaType?: EnumPersonaTypeWithAggregatesFilter<"Persona"> | $Enums.PersonaType
    personalityTraits?: StringNullableListFilter<"Persona">
    interests?: StringNullableListFilter<"Persona">
    expertise?: StringNullableListFilter<"Persona">
    toneStyle?: EnumToneStyleWithAggregatesFilter<"Persona"> | $Enums.ToneStyle
    controversyTolerance?: IntWithAggregatesFilter<"Persona"> | number
    engagementFrequency?: IntWithAggregatesFilter<"Persona"> | number
    debateAggression?: IntWithAggregatesFilter<"Persona"> | number
    politicalAlignmentId?: StringWithAggregatesFilter<"Persona"> | string
    aiProvider?: StringWithAggregatesFilter<"Persona"> | string
    systemPrompt?: StringWithAggregatesFilter<"Persona"> | string
    contextWindow?: IntWithAggregatesFilter<"Persona"> | number
    postingSchedule?: JsonWithAggregatesFilter<"Persona">
    timezonePreference?: StringWithAggregatesFilter<"Persona"> | string
    isActive?: BoolWithAggregatesFilter<"Persona"> | boolean
    isDefault?: BoolWithAggregatesFilter<"Persona"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Persona"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Persona"> | Date | string
  }

  export type NewsItemWhereInput = {
    AND?: NewsItemWhereInput | NewsItemWhereInput[]
    OR?: NewsItemWhereInput[]
    NOT?: NewsItemWhereInput | NewsItemWhereInput[]
    id?: StringFilter<"NewsItem"> | string
    title?: StringFilter<"NewsItem"> | string
    description?: StringFilter<"NewsItem"> | string
    content?: StringNullableFilter<"NewsItem"> | string | null
    url?: StringFilter<"NewsItem"> | string
    sourceName?: StringFilter<"NewsItem"> | string
    sourceUrl?: StringFilter<"NewsItem"> | string
    author?: StringNullableFilter<"NewsItem"> | string | null
    category?: EnumNewsCategoryFilter<"NewsItem"> | $Enums.NewsCategory
    topics?: StringNullableListFilter<"NewsItem">
    keywords?: StringNullableListFilter<"NewsItem">
    entities?: StringNullableListFilter<"NewsItem">
    country?: StringNullableFilter<"NewsItem"> | string | null
    region?: StringNullableFilter<"NewsItem"> | string | null
    language?: StringFilter<"NewsItem"> | string
    sentimentScore?: FloatFilter<"NewsItem"> | number
    impactScore?: IntFilter<"NewsItem"> | number
    controversyScore?: IntFilter<"NewsItem"> | number
    publishedAt?: DateTimeFilter<"NewsItem"> | Date | string
    discoveredAt?: DateTimeFilter<"NewsItem"> | Date | string
    createdAt?: DateTimeFilter<"NewsItem"> | Date | string
    updatedAt?: DateTimeFilter<"NewsItem"> | Date | string
    aiSummary?: StringNullableFilter<"NewsItem"> | string | null
    topicTags?: StringNullableListFilter<"NewsItem">
    trends?: TrendListRelationFilter
    relatedPosts?: PostListRelationFilter
  }

  export type NewsItemOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    content?: SortOrderInput | SortOrder
    url?: SortOrder
    sourceName?: SortOrder
    sourceUrl?: SortOrder
    author?: SortOrderInput | SortOrder
    category?: SortOrder
    topics?: SortOrder
    keywords?: SortOrder
    entities?: SortOrder
    country?: SortOrderInput | SortOrder
    region?: SortOrderInput | SortOrder
    language?: SortOrder
    sentimentScore?: SortOrder
    impactScore?: SortOrder
    controversyScore?: SortOrder
    publishedAt?: SortOrder
    discoveredAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    aiSummary?: SortOrderInput | SortOrder
    topicTags?: SortOrder
    trends?: TrendOrderByRelationAggregateInput
    relatedPosts?: PostOrderByRelationAggregateInput
  }

  export type NewsItemWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    url?: string
    AND?: NewsItemWhereInput | NewsItemWhereInput[]
    OR?: NewsItemWhereInput[]
    NOT?: NewsItemWhereInput | NewsItemWhereInput[]
    title?: StringFilter<"NewsItem"> | string
    description?: StringFilter<"NewsItem"> | string
    content?: StringNullableFilter<"NewsItem"> | string | null
    sourceName?: StringFilter<"NewsItem"> | string
    sourceUrl?: StringFilter<"NewsItem"> | string
    author?: StringNullableFilter<"NewsItem"> | string | null
    category?: EnumNewsCategoryFilter<"NewsItem"> | $Enums.NewsCategory
    topics?: StringNullableListFilter<"NewsItem">
    keywords?: StringNullableListFilter<"NewsItem">
    entities?: StringNullableListFilter<"NewsItem">
    country?: StringNullableFilter<"NewsItem"> | string | null
    region?: StringNullableFilter<"NewsItem"> | string | null
    language?: StringFilter<"NewsItem"> | string
    sentimentScore?: FloatFilter<"NewsItem"> | number
    impactScore?: IntFilter<"NewsItem"> | number
    controversyScore?: IntFilter<"NewsItem"> | number
    publishedAt?: DateTimeFilter<"NewsItem"> | Date | string
    discoveredAt?: DateTimeFilter<"NewsItem"> | Date | string
    createdAt?: DateTimeFilter<"NewsItem"> | Date | string
    updatedAt?: DateTimeFilter<"NewsItem"> | Date | string
    aiSummary?: StringNullableFilter<"NewsItem"> | string | null
    topicTags?: StringNullableListFilter<"NewsItem">
    trends?: TrendListRelationFilter
    relatedPosts?: PostListRelationFilter
  }, "id" | "url">

  export type NewsItemOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    content?: SortOrderInput | SortOrder
    url?: SortOrder
    sourceName?: SortOrder
    sourceUrl?: SortOrder
    author?: SortOrderInput | SortOrder
    category?: SortOrder
    topics?: SortOrder
    keywords?: SortOrder
    entities?: SortOrder
    country?: SortOrderInput | SortOrder
    region?: SortOrderInput | SortOrder
    language?: SortOrder
    sentimentScore?: SortOrder
    impactScore?: SortOrder
    controversyScore?: SortOrder
    publishedAt?: SortOrder
    discoveredAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    aiSummary?: SortOrderInput | SortOrder
    topicTags?: SortOrder
    _count?: NewsItemCountOrderByAggregateInput
    _avg?: NewsItemAvgOrderByAggregateInput
    _max?: NewsItemMaxOrderByAggregateInput
    _min?: NewsItemMinOrderByAggregateInput
    _sum?: NewsItemSumOrderByAggregateInput
  }

  export type NewsItemScalarWhereWithAggregatesInput = {
    AND?: NewsItemScalarWhereWithAggregatesInput | NewsItemScalarWhereWithAggregatesInput[]
    OR?: NewsItemScalarWhereWithAggregatesInput[]
    NOT?: NewsItemScalarWhereWithAggregatesInput | NewsItemScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"NewsItem"> | string
    title?: StringWithAggregatesFilter<"NewsItem"> | string
    description?: StringWithAggregatesFilter<"NewsItem"> | string
    content?: StringNullableWithAggregatesFilter<"NewsItem"> | string | null
    url?: StringWithAggregatesFilter<"NewsItem"> | string
    sourceName?: StringWithAggregatesFilter<"NewsItem"> | string
    sourceUrl?: StringWithAggregatesFilter<"NewsItem"> | string
    author?: StringNullableWithAggregatesFilter<"NewsItem"> | string | null
    category?: EnumNewsCategoryWithAggregatesFilter<"NewsItem"> | $Enums.NewsCategory
    topics?: StringNullableListFilter<"NewsItem">
    keywords?: StringNullableListFilter<"NewsItem">
    entities?: StringNullableListFilter<"NewsItem">
    country?: StringNullableWithAggregatesFilter<"NewsItem"> | string | null
    region?: StringNullableWithAggregatesFilter<"NewsItem"> | string | null
    language?: StringWithAggregatesFilter<"NewsItem"> | string
    sentimentScore?: FloatWithAggregatesFilter<"NewsItem"> | number
    impactScore?: IntWithAggregatesFilter<"NewsItem"> | number
    controversyScore?: IntWithAggregatesFilter<"NewsItem"> | number
    publishedAt?: DateTimeWithAggregatesFilter<"NewsItem"> | Date | string
    discoveredAt?: DateTimeWithAggregatesFilter<"NewsItem"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"NewsItem"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"NewsItem"> | Date | string
    aiSummary?: StringNullableWithAggregatesFilter<"NewsItem"> | string | null
    topicTags?: StringNullableListFilter<"NewsItem">
  }

  export type TrendWhereInput = {
    AND?: TrendWhereInput | TrendWhereInput[]
    OR?: TrendWhereInput[]
    NOT?: TrendWhereInput | TrendWhereInput[]
    id?: StringFilter<"Trend"> | string
    hashtag?: StringNullableFilter<"Trend"> | string | null
    keyword?: StringNullableFilter<"Trend"> | string | null
    topic?: StringFilter<"Trend"> | string
    postCount?: IntFilter<"Trend"> | number
    uniqueUsers?: IntFilter<"Trend"> | number
    impressionCount?: IntFilter<"Trend"> | number
    engagementCount?: IntFilter<"Trend"> | number
    trendScore?: IntFilter<"Trend"> | number
    velocity?: FloatFilter<"Trend"> | number
    peakTime?: DateTimeNullableFilter<"Trend"> | Date | string | null
    category?: EnumTrendCategoryFilter<"Trend"> | $Enums.TrendCategory
    region?: StringNullableFilter<"Trend"> | string | null
    language?: StringFilter<"Trend"> | string
    isPromoted?: BoolFilter<"Trend"> | boolean
    isHidden?: BoolFilter<"Trend"> | boolean
    startedAt?: DateTimeFilter<"Trend"> | Date | string
    endedAt?: DateTimeNullableFilter<"Trend"> | Date | string | null
    lastUpdated?: DateTimeFilter<"Trend"> | Date | string
    createdAt?: DateTimeFilter<"Trend"> | Date | string
    newsItems?: NewsItemListRelationFilter
  }

  export type TrendOrderByWithRelationInput = {
    id?: SortOrder
    hashtag?: SortOrderInput | SortOrder
    keyword?: SortOrderInput | SortOrder
    topic?: SortOrder
    postCount?: SortOrder
    uniqueUsers?: SortOrder
    impressionCount?: SortOrder
    engagementCount?: SortOrder
    trendScore?: SortOrder
    velocity?: SortOrder
    peakTime?: SortOrderInput | SortOrder
    category?: SortOrder
    region?: SortOrderInput | SortOrder
    language?: SortOrder
    isPromoted?: SortOrder
    isHidden?: SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrderInput | SortOrder
    lastUpdated?: SortOrder
    createdAt?: SortOrder
    newsItems?: NewsItemOrderByRelationAggregateInput
  }

  export type TrendWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TrendWhereInput | TrendWhereInput[]
    OR?: TrendWhereInput[]
    NOT?: TrendWhereInput | TrendWhereInput[]
    hashtag?: StringNullableFilter<"Trend"> | string | null
    keyword?: StringNullableFilter<"Trend"> | string | null
    topic?: StringFilter<"Trend"> | string
    postCount?: IntFilter<"Trend"> | number
    uniqueUsers?: IntFilter<"Trend"> | number
    impressionCount?: IntFilter<"Trend"> | number
    engagementCount?: IntFilter<"Trend"> | number
    trendScore?: IntFilter<"Trend"> | number
    velocity?: FloatFilter<"Trend"> | number
    peakTime?: DateTimeNullableFilter<"Trend"> | Date | string | null
    category?: EnumTrendCategoryFilter<"Trend"> | $Enums.TrendCategory
    region?: StringNullableFilter<"Trend"> | string | null
    language?: StringFilter<"Trend"> | string
    isPromoted?: BoolFilter<"Trend"> | boolean
    isHidden?: BoolFilter<"Trend"> | boolean
    startedAt?: DateTimeFilter<"Trend"> | Date | string
    endedAt?: DateTimeNullableFilter<"Trend"> | Date | string | null
    lastUpdated?: DateTimeFilter<"Trend"> | Date | string
    createdAt?: DateTimeFilter<"Trend"> | Date | string
    newsItems?: NewsItemListRelationFilter
  }, "id">

  export type TrendOrderByWithAggregationInput = {
    id?: SortOrder
    hashtag?: SortOrderInput | SortOrder
    keyword?: SortOrderInput | SortOrder
    topic?: SortOrder
    postCount?: SortOrder
    uniqueUsers?: SortOrder
    impressionCount?: SortOrder
    engagementCount?: SortOrder
    trendScore?: SortOrder
    velocity?: SortOrder
    peakTime?: SortOrderInput | SortOrder
    category?: SortOrder
    region?: SortOrderInput | SortOrder
    language?: SortOrder
    isPromoted?: SortOrder
    isHidden?: SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrderInput | SortOrder
    lastUpdated?: SortOrder
    createdAt?: SortOrder
    _count?: TrendCountOrderByAggregateInput
    _avg?: TrendAvgOrderByAggregateInput
    _max?: TrendMaxOrderByAggregateInput
    _min?: TrendMinOrderByAggregateInput
    _sum?: TrendSumOrderByAggregateInput
  }

  export type TrendScalarWhereWithAggregatesInput = {
    AND?: TrendScalarWhereWithAggregatesInput | TrendScalarWhereWithAggregatesInput[]
    OR?: TrendScalarWhereWithAggregatesInput[]
    NOT?: TrendScalarWhereWithAggregatesInput | TrendScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Trend"> | string
    hashtag?: StringNullableWithAggregatesFilter<"Trend"> | string | null
    keyword?: StringNullableWithAggregatesFilter<"Trend"> | string | null
    topic?: StringWithAggregatesFilter<"Trend"> | string
    postCount?: IntWithAggregatesFilter<"Trend"> | number
    uniqueUsers?: IntWithAggregatesFilter<"Trend"> | number
    impressionCount?: IntWithAggregatesFilter<"Trend"> | number
    engagementCount?: IntWithAggregatesFilter<"Trend"> | number
    trendScore?: IntWithAggregatesFilter<"Trend"> | number
    velocity?: FloatWithAggregatesFilter<"Trend"> | number
    peakTime?: DateTimeNullableWithAggregatesFilter<"Trend"> | Date | string | null
    category?: EnumTrendCategoryWithAggregatesFilter<"Trend"> | $Enums.TrendCategory
    region?: StringNullableWithAggregatesFilter<"Trend"> | string | null
    language?: StringWithAggregatesFilter<"Trend"> | string
    isPromoted?: BoolWithAggregatesFilter<"Trend"> | boolean
    isHidden?: BoolWithAggregatesFilter<"Trend"> | boolean
    startedAt?: DateTimeWithAggregatesFilter<"Trend"> | Date | string
    endedAt?: DateTimeNullableWithAggregatesFilter<"Trend"> | Date | string | null
    lastUpdated?: DateTimeWithAggregatesFilter<"Trend"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"Trend"> | Date | string
  }

  export type UserAccountCreateInput = {
    id?: string
    username: string
    email: string
    passwordHash: string
    emailVerified?: boolean
    isActive?: boolean
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    profile?: UserProfileCreateNestedOneWithoutUserInput
    politicalAlignment?: PoliticalAlignmentCreateNestedOneWithoutUserInput
    influenceMetrics?: InfluenceMetricsCreateNestedOneWithoutUserInput
    settings?: SettingsCreateNestedOneWithoutUserInput
    posts?: PostCreateNestedManyWithoutAuthorInput
    reactions?: ReactionCreateNestedManyWithoutUserInput
  }

  export type UserAccountUncheckedCreateInput = {
    id?: string
    username: string
    email: string
    passwordHash: string
    emailVerified?: boolean
    isActive?: boolean
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    profile?: UserProfileUncheckedCreateNestedOneWithoutUserInput
    politicalAlignment?: PoliticalAlignmentUncheckedCreateNestedOneWithoutUserInput
    influenceMetrics?: InfluenceMetricsUncheckedCreateNestedOneWithoutUserInput
    settings?: SettingsUncheckedCreateNestedOneWithoutUserInput
    posts?: PostUncheckedCreateNestedManyWithoutAuthorInput
    reactions?: ReactionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserAccountUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: UserProfileUpdateOneWithoutUserNestedInput
    politicalAlignment?: PoliticalAlignmentUpdateOneWithoutUserNestedInput
    influenceMetrics?: InfluenceMetricsUpdateOneWithoutUserNestedInput
    settings?: SettingsUpdateOneWithoutUserNestedInput
    posts?: PostUpdateManyWithoutAuthorNestedInput
    reactions?: ReactionUpdateManyWithoutUserNestedInput
  }

  export type UserAccountUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: UserProfileUncheckedUpdateOneWithoutUserNestedInput
    politicalAlignment?: PoliticalAlignmentUncheckedUpdateOneWithoutUserNestedInput
    influenceMetrics?: InfluenceMetricsUncheckedUpdateOneWithoutUserNestedInput
    settings?: SettingsUncheckedUpdateOneWithoutUserNestedInput
    posts?: PostUncheckedUpdateManyWithoutAuthorNestedInput
    reactions?: ReactionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserAccountCreateManyInput = {
    id?: string
    username: string
    email: string
    passwordHash: string
    emailVerified?: boolean
    isActive?: boolean
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserAccountUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserAccountUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserProfileCreateInput = {
    id?: string
    displayName: string
    bio?: string | null
    profileImageUrl?: string | null
    headerImageUrl?: string | null
    location?: string | null
    website?: string | null
    personaType: $Enums.PersonaType
    specialtyAreas?: UserProfileCreatespecialtyAreasInput | string[]
    verificationBadge?: boolean
    followerCount?: number
    followingCount?: number
    postCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserAccountCreateNestedOneWithoutProfileInput
  }

  export type UserProfileUncheckedCreateInput = {
    id?: string
    userId: string
    displayName: string
    bio?: string | null
    profileImageUrl?: string | null
    headerImageUrl?: string | null
    location?: string | null
    website?: string | null
    personaType: $Enums.PersonaType
    specialtyAreas?: UserProfileCreatespecialtyAreasInput | string[]
    verificationBadge?: boolean
    followerCount?: number
    followingCount?: number
    postCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserProfileUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    profileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    headerImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    personaType?: EnumPersonaTypeFieldUpdateOperationsInput | $Enums.PersonaType
    specialtyAreas?: UserProfileUpdatespecialtyAreasInput | string[]
    verificationBadge?: BoolFieldUpdateOperationsInput | boolean
    followerCount?: IntFieldUpdateOperationsInput | number
    followingCount?: IntFieldUpdateOperationsInput | number
    postCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserAccountUpdateOneRequiredWithoutProfileNestedInput
  }

  export type UserProfileUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    profileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    headerImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    personaType?: EnumPersonaTypeFieldUpdateOperationsInput | $Enums.PersonaType
    specialtyAreas?: UserProfileUpdatespecialtyAreasInput | string[]
    verificationBadge?: BoolFieldUpdateOperationsInput | boolean
    followerCount?: IntFieldUpdateOperationsInput | number
    followingCount?: IntFieldUpdateOperationsInput | number
    postCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserProfileCreateManyInput = {
    id?: string
    userId: string
    displayName: string
    bio?: string | null
    profileImageUrl?: string | null
    headerImageUrl?: string | null
    location?: string | null
    website?: string | null
    personaType: $Enums.PersonaType
    specialtyAreas?: UserProfileCreatespecialtyAreasInput | string[]
    verificationBadge?: boolean
    followerCount?: number
    followingCount?: number
    postCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserProfileUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    profileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    headerImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    personaType?: EnumPersonaTypeFieldUpdateOperationsInput | $Enums.PersonaType
    specialtyAreas?: UserProfileUpdatespecialtyAreasInput | string[]
    verificationBadge?: BoolFieldUpdateOperationsInput | boolean
    followerCount?: IntFieldUpdateOperationsInput | number
    followingCount?: IntFieldUpdateOperationsInput | number
    postCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserProfileUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    profileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    headerImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    personaType?: EnumPersonaTypeFieldUpdateOperationsInput | $Enums.PersonaType
    specialtyAreas?: UserProfileUpdatespecialtyAreasInput | string[]
    verificationBadge?: BoolFieldUpdateOperationsInput | boolean
    followerCount?: IntFieldUpdateOperationsInput | number
    followingCount?: IntFieldUpdateOperationsInput | number
    postCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PoliticalAlignmentCreateInput = {
    id?: string
    economicPosition: number
    socialPosition: number
    primaryIssues?: PoliticalAlignmentCreateprimaryIssuesInput | string[]
    partyAffiliation?: string | null
    ideologyTags?: PoliticalAlignmentCreateideologyTagsInput | string[]
    debateWillingness: number
    controversyTolerance: number
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserAccountCreateNestedOneWithoutPoliticalAlignmentInput
    personas?: PersonaCreateNestedManyWithoutPoliticalAlignmentInput
  }

  export type PoliticalAlignmentUncheckedCreateInput = {
    id?: string
    userId: string
    economicPosition: number
    socialPosition: number
    primaryIssues?: PoliticalAlignmentCreateprimaryIssuesInput | string[]
    partyAffiliation?: string | null
    ideologyTags?: PoliticalAlignmentCreateideologyTagsInput | string[]
    debateWillingness: number
    controversyTolerance: number
    createdAt?: Date | string
    updatedAt?: Date | string
    personas?: PersonaUncheckedCreateNestedManyWithoutPoliticalAlignmentInput
  }

  export type PoliticalAlignmentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    economicPosition?: IntFieldUpdateOperationsInput | number
    socialPosition?: IntFieldUpdateOperationsInput | number
    primaryIssues?: PoliticalAlignmentUpdateprimaryIssuesInput | string[]
    partyAffiliation?: NullableStringFieldUpdateOperationsInput | string | null
    ideologyTags?: PoliticalAlignmentUpdateideologyTagsInput | string[]
    debateWillingness?: IntFieldUpdateOperationsInput | number
    controversyTolerance?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserAccountUpdateOneRequiredWithoutPoliticalAlignmentNestedInput
    personas?: PersonaUpdateManyWithoutPoliticalAlignmentNestedInput
  }

  export type PoliticalAlignmentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    economicPosition?: IntFieldUpdateOperationsInput | number
    socialPosition?: IntFieldUpdateOperationsInput | number
    primaryIssues?: PoliticalAlignmentUpdateprimaryIssuesInput | string[]
    partyAffiliation?: NullableStringFieldUpdateOperationsInput | string | null
    ideologyTags?: PoliticalAlignmentUpdateideologyTagsInput | string[]
    debateWillingness?: IntFieldUpdateOperationsInput | number
    controversyTolerance?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    personas?: PersonaUncheckedUpdateManyWithoutPoliticalAlignmentNestedInput
  }

  export type PoliticalAlignmentCreateManyInput = {
    id?: string
    userId: string
    economicPosition: number
    socialPosition: number
    primaryIssues?: PoliticalAlignmentCreateprimaryIssuesInput | string[]
    partyAffiliation?: string | null
    ideologyTags?: PoliticalAlignmentCreateideologyTagsInput | string[]
    debateWillingness: number
    controversyTolerance: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PoliticalAlignmentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    economicPosition?: IntFieldUpdateOperationsInput | number
    socialPosition?: IntFieldUpdateOperationsInput | number
    primaryIssues?: PoliticalAlignmentUpdateprimaryIssuesInput | string[]
    partyAffiliation?: NullableStringFieldUpdateOperationsInput | string | null
    ideologyTags?: PoliticalAlignmentUpdateideologyTagsInput | string[]
    debateWillingness?: IntFieldUpdateOperationsInput | number
    controversyTolerance?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PoliticalAlignmentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    economicPosition?: IntFieldUpdateOperationsInput | number
    socialPosition?: IntFieldUpdateOperationsInput | number
    primaryIssues?: PoliticalAlignmentUpdateprimaryIssuesInput | string[]
    partyAffiliation?: NullableStringFieldUpdateOperationsInput | string | null
    ideologyTags?: PoliticalAlignmentUpdateideologyTagsInput | string[]
    debateWillingness?: IntFieldUpdateOperationsInput | number
    controversyTolerance?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InfluenceMetricsCreateInput = {
    id?: string
    followerCount?: number
    followingCount?: number
    engagementRate?: number
    reachScore?: number
    approvalRating?: number
    controversyLevel?: number
    trendingScore?: number
    followerGrowthDaily?: number
    followerGrowthWeekly?: number
    followerGrowthMonthly?: number
    totalLikes?: number
    totalReshares?: number
    totalComments?: number
    influenceRank?: number
    categoryRank?: number
    lastUpdated?: Date | string
    createdAt?: Date | string
    user: UserAccountCreateNestedOneWithoutInfluenceMetricsInput
  }

  export type InfluenceMetricsUncheckedCreateInput = {
    id?: string
    userId: string
    followerCount?: number
    followingCount?: number
    engagementRate?: number
    reachScore?: number
    approvalRating?: number
    controversyLevel?: number
    trendingScore?: number
    followerGrowthDaily?: number
    followerGrowthWeekly?: number
    followerGrowthMonthly?: number
    totalLikes?: number
    totalReshares?: number
    totalComments?: number
    influenceRank?: number
    categoryRank?: number
    lastUpdated?: Date | string
    createdAt?: Date | string
  }

  export type InfluenceMetricsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    followerCount?: IntFieldUpdateOperationsInput | number
    followingCount?: IntFieldUpdateOperationsInput | number
    engagementRate?: FloatFieldUpdateOperationsInput | number
    reachScore?: IntFieldUpdateOperationsInput | number
    approvalRating?: IntFieldUpdateOperationsInput | number
    controversyLevel?: IntFieldUpdateOperationsInput | number
    trendingScore?: IntFieldUpdateOperationsInput | number
    followerGrowthDaily?: IntFieldUpdateOperationsInput | number
    followerGrowthWeekly?: IntFieldUpdateOperationsInput | number
    followerGrowthMonthly?: IntFieldUpdateOperationsInput | number
    totalLikes?: IntFieldUpdateOperationsInput | number
    totalReshares?: IntFieldUpdateOperationsInput | number
    totalComments?: IntFieldUpdateOperationsInput | number
    influenceRank?: IntFieldUpdateOperationsInput | number
    categoryRank?: IntFieldUpdateOperationsInput | number
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserAccountUpdateOneRequiredWithoutInfluenceMetricsNestedInput
  }

  export type InfluenceMetricsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    followerCount?: IntFieldUpdateOperationsInput | number
    followingCount?: IntFieldUpdateOperationsInput | number
    engagementRate?: FloatFieldUpdateOperationsInput | number
    reachScore?: IntFieldUpdateOperationsInput | number
    approvalRating?: IntFieldUpdateOperationsInput | number
    controversyLevel?: IntFieldUpdateOperationsInput | number
    trendingScore?: IntFieldUpdateOperationsInput | number
    followerGrowthDaily?: IntFieldUpdateOperationsInput | number
    followerGrowthWeekly?: IntFieldUpdateOperationsInput | number
    followerGrowthMonthly?: IntFieldUpdateOperationsInput | number
    totalLikes?: IntFieldUpdateOperationsInput | number
    totalReshares?: IntFieldUpdateOperationsInput | number
    totalComments?: IntFieldUpdateOperationsInput | number
    influenceRank?: IntFieldUpdateOperationsInput | number
    categoryRank?: IntFieldUpdateOperationsInput | number
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InfluenceMetricsCreateManyInput = {
    id?: string
    userId: string
    followerCount?: number
    followingCount?: number
    engagementRate?: number
    reachScore?: number
    approvalRating?: number
    controversyLevel?: number
    trendingScore?: number
    followerGrowthDaily?: number
    followerGrowthWeekly?: number
    followerGrowthMonthly?: number
    totalLikes?: number
    totalReshares?: number
    totalComments?: number
    influenceRank?: number
    categoryRank?: number
    lastUpdated?: Date | string
    createdAt?: Date | string
  }

  export type InfluenceMetricsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    followerCount?: IntFieldUpdateOperationsInput | number
    followingCount?: IntFieldUpdateOperationsInput | number
    engagementRate?: FloatFieldUpdateOperationsInput | number
    reachScore?: IntFieldUpdateOperationsInput | number
    approvalRating?: IntFieldUpdateOperationsInput | number
    controversyLevel?: IntFieldUpdateOperationsInput | number
    trendingScore?: IntFieldUpdateOperationsInput | number
    followerGrowthDaily?: IntFieldUpdateOperationsInput | number
    followerGrowthWeekly?: IntFieldUpdateOperationsInput | number
    followerGrowthMonthly?: IntFieldUpdateOperationsInput | number
    totalLikes?: IntFieldUpdateOperationsInput | number
    totalReshares?: IntFieldUpdateOperationsInput | number
    totalComments?: IntFieldUpdateOperationsInput | number
    influenceRank?: IntFieldUpdateOperationsInput | number
    categoryRank?: IntFieldUpdateOperationsInput | number
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InfluenceMetricsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    followerCount?: IntFieldUpdateOperationsInput | number
    followingCount?: IntFieldUpdateOperationsInput | number
    engagementRate?: FloatFieldUpdateOperationsInput | number
    reachScore?: IntFieldUpdateOperationsInput | number
    approvalRating?: IntFieldUpdateOperationsInput | number
    controversyLevel?: IntFieldUpdateOperationsInput | number
    trendingScore?: IntFieldUpdateOperationsInput | number
    followerGrowthDaily?: IntFieldUpdateOperationsInput | number
    followerGrowthWeekly?: IntFieldUpdateOperationsInput | number
    followerGrowthMonthly?: IntFieldUpdateOperationsInput | number
    totalLikes?: IntFieldUpdateOperationsInput | number
    totalReshares?: IntFieldUpdateOperationsInput | number
    totalComments?: IntFieldUpdateOperationsInput | number
    influenceRank?: IntFieldUpdateOperationsInput | number
    categoryRank?: IntFieldUpdateOperationsInput | number
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SettingsCreateInput = {
    id?: string
    newsRegion?: string
    newsCategories?: SettingsCreatenewsCategoriesInput | $Enums.NewsCategory[]
    newsLanguages?: SettingsCreatenewsLanguagesInput | string[]
    aiChatterLevel?: number
    aiPersonalities?: SettingsCreateaiPersonalitiesInput | string[]
    aiResponseTone?: $Enums.ToneStyle
    emailNotifications?: boolean
    pushNotifications?: boolean
    notificationCategories?: SettingsCreatenotificationCategoriesInput | $Enums.NotificationCategory[]
    profileVisibility?: $Enums.ProfileVisibility
    allowPersonaInteractions?: boolean
    allowDataForAI?: boolean
    theme?: $Enums.Theme
    language?: string
    timezone?: string
    customAIApiKey?: string | null
    customAIBaseUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserAccountCreateNestedOneWithoutSettingsInput
  }

  export type SettingsUncheckedCreateInput = {
    id?: string
    userId: string
    newsRegion?: string
    newsCategories?: SettingsCreatenewsCategoriesInput | $Enums.NewsCategory[]
    newsLanguages?: SettingsCreatenewsLanguagesInput | string[]
    aiChatterLevel?: number
    aiPersonalities?: SettingsCreateaiPersonalitiesInput | string[]
    aiResponseTone?: $Enums.ToneStyle
    emailNotifications?: boolean
    pushNotifications?: boolean
    notificationCategories?: SettingsCreatenotificationCategoriesInput | $Enums.NotificationCategory[]
    profileVisibility?: $Enums.ProfileVisibility
    allowPersonaInteractions?: boolean
    allowDataForAI?: boolean
    theme?: $Enums.Theme
    language?: string
    timezone?: string
    customAIApiKey?: string | null
    customAIBaseUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SettingsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    newsRegion?: StringFieldUpdateOperationsInput | string
    newsCategories?: SettingsUpdatenewsCategoriesInput | $Enums.NewsCategory[]
    newsLanguages?: SettingsUpdatenewsLanguagesInput | string[]
    aiChatterLevel?: IntFieldUpdateOperationsInput | number
    aiPersonalities?: SettingsUpdateaiPersonalitiesInput | string[]
    aiResponseTone?: EnumToneStyleFieldUpdateOperationsInput | $Enums.ToneStyle
    emailNotifications?: BoolFieldUpdateOperationsInput | boolean
    pushNotifications?: BoolFieldUpdateOperationsInput | boolean
    notificationCategories?: SettingsUpdatenotificationCategoriesInput | $Enums.NotificationCategory[]
    profileVisibility?: EnumProfileVisibilityFieldUpdateOperationsInput | $Enums.ProfileVisibility
    allowPersonaInteractions?: BoolFieldUpdateOperationsInput | boolean
    allowDataForAI?: BoolFieldUpdateOperationsInput | boolean
    theme?: EnumThemeFieldUpdateOperationsInput | $Enums.Theme
    language?: StringFieldUpdateOperationsInput | string
    timezone?: StringFieldUpdateOperationsInput | string
    customAIApiKey?: NullableStringFieldUpdateOperationsInput | string | null
    customAIBaseUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserAccountUpdateOneRequiredWithoutSettingsNestedInput
  }

  export type SettingsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    newsRegion?: StringFieldUpdateOperationsInput | string
    newsCategories?: SettingsUpdatenewsCategoriesInput | $Enums.NewsCategory[]
    newsLanguages?: SettingsUpdatenewsLanguagesInput | string[]
    aiChatterLevel?: IntFieldUpdateOperationsInput | number
    aiPersonalities?: SettingsUpdateaiPersonalitiesInput | string[]
    aiResponseTone?: EnumToneStyleFieldUpdateOperationsInput | $Enums.ToneStyle
    emailNotifications?: BoolFieldUpdateOperationsInput | boolean
    pushNotifications?: BoolFieldUpdateOperationsInput | boolean
    notificationCategories?: SettingsUpdatenotificationCategoriesInput | $Enums.NotificationCategory[]
    profileVisibility?: EnumProfileVisibilityFieldUpdateOperationsInput | $Enums.ProfileVisibility
    allowPersonaInteractions?: BoolFieldUpdateOperationsInput | boolean
    allowDataForAI?: BoolFieldUpdateOperationsInput | boolean
    theme?: EnumThemeFieldUpdateOperationsInput | $Enums.Theme
    language?: StringFieldUpdateOperationsInput | string
    timezone?: StringFieldUpdateOperationsInput | string
    customAIApiKey?: NullableStringFieldUpdateOperationsInput | string | null
    customAIBaseUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SettingsCreateManyInput = {
    id?: string
    userId: string
    newsRegion?: string
    newsCategories?: SettingsCreatenewsCategoriesInput | $Enums.NewsCategory[]
    newsLanguages?: SettingsCreatenewsLanguagesInput | string[]
    aiChatterLevel?: number
    aiPersonalities?: SettingsCreateaiPersonalitiesInput | string[]
    aiResponseTone?: $Enums.ToneStyle
    emailNotifications?: boolean
    pushNotifications?: boolean
    notificationCategories?: SettingsCreatenotificationCategoriesInput | $Enums.NotificationCategory[]
    profileVisibility?: $Enums.ProfileVisibility
    allowPersonaInteractions?: boolean
    allowDataForAI?: boolean
    theme?: $Enums.Theme
    language?: string
    timezone?: string
    customAIApiKey?: string | null
    customAIBaseUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SettingsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    newsRegion?: StringFieldUpdateOperationsInput | string
    newsCategories?: SettingsUpdatenewsCategoriesInput | $Enums.NewsCategory[]
    newsLanguages?: SettingsUpdatenewsLanguagesInput | string[]
    aiChatterLevel?: IntFieldUpdateOperationsInput | number
    aiPersonalities?: SettingsUpdateaiPersonalitiesInput | string[]
    aiResponseTone?: EnumToneStyleFieldUpdateOperationsInput | $Enums.ToneStyle
    emailNotifications?: BoolFieldUpdateOperationsInput | boolean
    pushNotifications?: BoolFieldUpdateOperationsInput | boolean
    notificationCategories?: SettingsUpdatenotificationCategoriesInput | $Enums.NotificationCategory[]
    profileVisibility?: EnumProfileVisibilityFieldUpdateOperationsInput | $Enums.ProfileVisibility
    allowPersonaInteractions?: BoolFieldUpdateOperationsInput | boolean
    allowDataForAI?: BoolFieldUpdateOperationsInput | boolean
    theme?: EnumThemeFieldUpdateOperationsInput | $Enums.Theme
    language?: StringFieldUpdateOperationsInput | string
    timezone?: StringFieldUpdateOperationsInput | string
    customAIApiKey?: NullableStringFieldUpdateOperationsInput | string | null
    customAIBaseUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SettingsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    newsRegion?: StringFieldUpdateOperationsInput | string
    newsCategories?: SettingsUpdatenewsCategoriesInput | $Enums.NewsCategory[]
    newsLanguages?: SettingsUpdatenewsLanguagesInput | string[]
    aiChatterLevel?: IntFieldUpdateOperationsInput | number
    aiPersonalities?: SettingsUpdateaiPersonalitiesInput | string[]
    aiResponseTone?: EnumToneStyleFieldUpdateOperationsInput | $Enums.ToneStyle
    emailNotifications?: BoolFieldUpdateOperationsInput | boolean
    pushNotifications?: BoolFieldUpdateOperationsInput | boolean
    notificationCategories?: SettingsUpdatenotificationCategoriesInput | $Enums.NotificationCategory[]
    profileVisibility?: EnumProfileVisibilityFieldUpdateOperationsInput | $Enums.ProfileVisibility
    allowPersonaInteractions?: BoolFieldUpdateOperationsInput | boolean
    allowDataForAI?: BoolFieldUpdateOperationsInput | boolean
    theme?: EnumThemeFieldUpdateOperationsInput | $Enums.Theme
    language?: StringFieldUpdateOperationsInput | string
    timezone?: StringFieldUpdateOperationsInput | string
    customAIApiKey?: NullableStringFieldUpdateOperationsInput | string | null
    customAIBaseUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PostCreateInput = {
    id?: string
    content: string
    mediaUrls?: PostCreatemediaUrlsInput | string[]
    linkPreview?: NullableJsonNullValueInput | InputJsonValue
    isAIGenerated?: boolean
    hashtags?: PostCreatehashtagsInput | string[]
    mentions?: PostCreatementionsInput | string[]
    newsContext?: string | null
    likeCount?: number
    repostCount?: number
    commentCount?: number
    impressionCount?: number
    contentWarning?: string | null
    isHidden?: boolean
    reportCount?: number
    publishedAt?: Date | string
    editedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    author: UserAccountCreateNestedOneWithoutPostsInput
    persona?: PersonaCreateNestedOneWithoutPostsInput
    thread: ThreadCreateNestedOneWithoutPostsInput
    parentPost?: PostCreateNestedOneWithoutRepliesInput
    repostOf?: PostCreateNestedOneWithoutRepostsInput
    newsItem?: NewsItemCreateNestedOneWithoutRelatedPostsInput
    replies?: PostCreateNestedManyWithoutParentPostInput
    reposts?: PostCreateNestedManyWithoutRepostOfInput
    reactions?: ReactionCreateNestedManyWithoutPostInput
  }

  export type PostUncheckedCreateInput = {
    id?: string
    authorId: string
    personaId?: string | null
    content: string
    mediaUrls?: PostCreatemediaUrlsInput | string[]
    linkPreview?: NullableJsonNullValueInput | InputJsonValue
    threadId: string
    parentPostId?: string | null
    repostOfId?: string | null
    isAIGenerated?: boolean
    hashtags?: PostCreatehashtagsInput | string[]
    mentions?: PostCreatementionsInput | string[]
    newsItemId?: string | null
    newsContext?: string | null
    likeCount?: number
    repostCount?: number
    commentCount?: number
    impressionCount?: number
    contentWarning?: string | null
    isHidden?: boolean
    reportCount?: number
    publishedAt?: Date | string
    editedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    replies?: PostUncheckedCreateNestedManyWithoutParentPostInput
    reposts?: PostUncheckedCreateNestedManyWithoutRepostOfInput
    reactions?: ReactionUncheckedCreateNestedManyWithoutPostInput
  }

  export type PostUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    mediaUrls?: PostUpdatemediaUrlsInput | string[]
    linkPreview?: NullableJsonNullValueInput | InputJsonValue
    isAIGenerated?: BoolFieldUpdateOperationsInput | boolean
    hashtags?: PostUpdatehashtagsInput | string[]
    mentions?: PostUpdatementionsInput | string[]
    newsContext?: NullableStringFieldUpdateOperationsInput | string | null
    likeCount?: IntFieldUpdateOperationsInput | number
    repostCount?: IntFieldUpdateOperationsInput | number
    commentCount?: IntFieldUpdateOperationsInput | number
    impressionCount?: IntFieldUpdateOperationsInput | number
    contentWarning?: NullableStringFieldUpdateOperationsInput | string | null
    isHidden?: BoolFieldUpdateOperationsInput | boolean
    reportCount?: IntFieldUpdateOperationsInput | number
    publishedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    editedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    author?: UserAccountUpdateOneRequiredWithoutPostsNestedInput
    persona?: PersonaUpdateOneWithoutPostsNestedInput
    thread?: ThreadUpdateOneRequiredWithoutPostsNestedInput
    parentPost?: PostUpdateOneWithoutRepliesNestedInput
    repostOf?: PostUpdateOneWithoutRepostsNestedInput
    newsItem?: NewsItemUpdateOneWithoutRelatedPostsNestedInput
    replies?: PostUpdateManyWithoutParentPostNestedInput
    reposts?: PostUpdateManyWithoutRepostOfNestedInput
    reactions?: ReactionUpdateManyWithoutPostNestedInput
  }

  export type PostUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    personaId?: NullableStringFieldUpdateOperationsInput | string | null
    content?: StringFieldUpdateOperationsInput | string
    mediaUrls?: PostUpdatemediaUrlsInput | string[]
    linkPreview?: NullableJsonNullValueInput | InputJsonValue
    threadId?: StringFieldUpdateOperationsInput | string
    parentPostId?: NullableStringFieldUpdateOperationsInput | string | null
    repostOfId?: NullableStringFieldUpdateOperationsInput | string | null
    isAIGenerated?: BoolFieldUpdateOperationsInput | boolean
    hashtags?: PostUpdatehashtagsInput | string[]
    mentions?: PostUpdatementionsInput | string[]
    newsItemId?: NullableStringFieldUpdateOperationsInput | string | null
    newsContext?: NullableStringFieldUpdateOperationsInput | string | null
    likeCount?: IntFieldUpdateOperationsInput | number
    repostCount?: IntFieldUpdateOperationsInput | number
    commentCount?: IntFieldUpdateOperationsInput | number
    impressionCount?: IntFieldUpdateOperationsInput | number
    contentWarning?: NullableStringFieldUpdateOperationsInput | string | null
    isHidden?: BoolFieldUpdateOperationsInput | boolean
    reportCount?: IntFieldUpdateOperationsInput | number
    publishedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    editedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    replies?: PostUncheckedUpdateManyWithoutParentPostNestedInput
    reposts?: PostUncheckedUpdateManyWithoutRepostOfNestedInput
    reactions?: ReactionUncheckedUpdateManyWithoutPostNestedInput
  }

  export type PostCreateManyInput = {
    id?: string
    authorId: string
    personaId?: string | null
    content: string
    mediaUrls?: PostCreatemediaUrlsInput | string[]
    linkPreview?: NullableJsonNullValueInput | InputJsonValue
    threadId: string
    parentPostId?: string | null
    repostOfId?: string | null
    isAIGenerated?: boolean
    hashtags?: PostCreatehashtagsInput | string[]
    mentions?: PostCreatementionsInput | string[]
    newsItemId?: string | null
    newsContext?: string | null
    likeCount?: number
    repostCount?: number
    commentCount?: number
    impressionCount?: number
    contentWarning?: string | null
    isHidden?: boolean
    reportCount?: number
    publishedAt?: Date | string
    editedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PostUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    mediaUrls?: PostUpdatemediaUrlsInput | string[]
    linkPreview?: NullableJsonNullValueInput | InputJsonValue
    isAIGenerated?: BoolFieldUpdateOperationsInput | boolean
    hashtags?: PostUpdatehashtagsInput | string[]
    mentions?: PostUpdatementionsInput | string[]
    newsContext?: NullableStringFieldUpdateOperationsInput | string | null
    likeCount?: IntFieldUpdateOperationsInput | number
    repostCount?: IntFieldUpdateOperationsInput | number
    commentCount?: IntFieldUpdateOperationsInput | number
    impressionCount?: IntFieldUpdateOperationsInput | number
    contentWarning?: NullableStringFieldUpdateOperationsInput | string | null
    isHidden?: BoolFieldUpdateOperationsInput | boolean
    reportCount?: IntFieldUpdateOperationsInput | number
    publishedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    editedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PostUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    personaId?: NullableStringFieldUpdateOperationsInput | string | null
    content?: StringFieldUpdateOperationsInput | string
    mediaUrls?: PostUpdatemediaUrlsInput | string[]
    linkPreview?: NullableJsonNullValueInput | InputJsonValue
    threadId?: StringFieldUpdateOperationsInput | string
    parentPostId?: NullableStringFieldUpdateOperationsInput | string | null
    repostOfId?: NullableStringFieldUpdateOperationsInput | string | null
    isAIGenerated?: BoolFieldUpdateOperationsInput | boolean
    hashtags?: PostUpdatehashtagsInput | string[]
    mentions?: PostUpdatementionsInput | string[]
    newsItemId?: NullableStringFieldUpdateOperationsInput | string | null
    newsContext?: NullableStringFieldUpdateOperationsInput | string | null
    likeCount?: IntFieldUpdateOperationsInput | number
    repostCount?: IntFieldUpdateOperationsInput | number
    commentCount?: IntFieldUpdateOperationsInput | number
    impressionCount?: IntFieldUpdateOperationsInput | number
    contentWarning?: NullableStringFieldUpdateOperationsInput | string | null
    isHidden?: BoolFieldUpdateOperationsInput | boolean
    reportCount?: IntFieldUpdateOperationsInput | number
    publishedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    editedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ThreadCreateInput = {
    id?: string
    originalPostId: string
    title?: string | null
    participantCount?: number
    postCount?: number
    maxDepth?: number
    totalLikes?: number
    totalReshares?: number
    lastActivityAt?: Date | string
    isLocked?: boolean
    isHidden?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    posts?: PostCreateNestedManyWithoutThreadInput
  }

  export type ThreadUncheckedCreateInput = {
    id?: string
    originalPostId: string
    title?: string | null
    participantCount?: number
    postCount?: number
    maxDepth?: number
    totalLikes?: number
    totalReshares?: number
    lastActivityAt?: Date | string
    isLocked?: boolean
    isHidden?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    posts?: PostUncheckedCreateNestedManyWithoutThreadInput
  }

  export type ThreadUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    originalPostId?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    participantCount?: IntFieldUpdateOperationsInput | number
    postCount?: IntFieldUpdateOperationsInput | number
    maxDepth?: IntFieldUpdateOperationsInput | number
    totalLikes?: IntFieldUpdateOperationsInput | number
    totalReshares?: IntFieldUpdateOperationsInput | number
    lastActivityAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isLocked?: BoolFieldUpdateOperationsInput | boolean
    isHidden?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    posts?: PostUpdateManyWithoutThreadNestedInput
  }

  export type ThreadUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    originalPostId?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    participantCount?: IntFieldUpdateOperationsInput | number
    postCount?: IntFieldUpdateOperationsInput | number
    maxDepth?: IntFieldUpdateOperationsInput | number
    totalLikes?: IntFieldUpdateOperationsInput | number
    totalReshares?: IntFieldUpdateOperationsInput | number
    lastActivityAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isLocked?: BoolFieldUpdateOperationsInput | boolean
    isHidden?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    posts?: PostUncheckedUpdateManyWithoutThreadNestedInput
  }

  export type ThreadCreateManyInput = {
    id?: string
    originalPostId: string
    title?: string | null
    participantCount?: number
    postCount?: number
    maxDepth?: number
    totalLikes?: number
    totalReshares?: number
    lastActivityAt?: Date | string
    isLocked?: boolean
    isHidden?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ThreadUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    originalPostId?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    participantCount?: IntFieldUpdateOperationsInput | number
    postCount?: IntFieldUpdateOperationsInput | number
    maxDepth?: IntFieldUpdateOperationsInput | number
    totalLikes?: IntFieldUpdateOperationsInput | number
    totalReshares?: IntFieldUpdateOperationsInput | number
    lastActivityAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isLocked?: BoolFieldUpdateOperationsInput | boolean
    isHidden?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ThreadUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    originalPostId?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    participantCount?: IntFieldUpdateOperationsInput | number
    postCount?: IntFieldUpdateOperationsInput | number
    maxDepth?: IntFieldUpdateOperationsInput | number
    totalLikes?: IntFieldUpdateOperationsInput | number
    totalReshares?: IntFieldUpdateOperationsInput | number
    lastActivityAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isLocked?: BoolFieldUpdateOperationsInput | boolean
    isHidden?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReactionCreateInput = {
    id?: string
    type: $Enums.ReactionType
    createdAt?: Date | string
    user: UserAccountCreateNestedOneWithoutReactionsInput
    post: PostCreateNestedOneWithoutReactionsInput
  }

  export type ReactionUncheckedCreateInput = {
    id?: string
    userId: string
    postId: string
    type: $Enums.ReactionType
    createdAt?: Date | string
  }

  export type ReactionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumReactionTypeFieldUpdateOperationsInput | $Enums.ReactionType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserAccountUpdateOneRequiredWithoutReactionsNestedInput
    post?: PostUpdateOneRequiredWithoutReactionsNestedInput
  }

  export type ReactionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    postId?: StringFieldUpdateOperationsInput | string
    type?: EnumReactionTypeFieldUpdateOperationsInput | $Enums.ReactionType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReactionCreateManyInput = {
    id?: string
    userId: string
    postId: string
    type: $Enums.ReactionType
    createdAt?: Date | string
  }

  export type ReactionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumReactionTypeFieldUpdateOperationsInput | $Enums.ReactionType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReactionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    postId?: StringFieldUpdateOperationsInput | string
    type?: EnumReactionTypeFieldUpdateOperationsInput | $Enums.ReactionType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PersonaCreateInput = {
    id?: string
    name: string
    handle: string
    bio: string
    profileImageUrl: string
    personaType: $Enums.PersonaType
    personalityTraits?: PersonaCreatepersonalityTraitsInput | string[]
    interests?: PersonaCreateinterestsInput | string[]
    expertise?: PersonaCreateexpertiseInput | string[]
    toneStyle?: $Enums.ToneStyle
    controversyTolerance?: number
    engagementFrequency?: number
    debateAggression?: number
    aiProvider?: string
    systemPrompt: string
    contextWindow?: number
    postingSchedule: JsonNullValueInput | InputJsonValue
    timezonePreference?: string
    isActive?: boolean
    isDefault?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    politicalAlignment: PoliticalAlignmentCreateNestedOneWithoutPersonasInput
    posts?: PostCreateNestedManyWithoutPersonaInput
  }

  export type PersonaUncheckedCreateInput = {
    id?: string
    name: string
    handle: string
    bio: string
    profileImageUrl: string
    personaType: $Enums.PersonaType
    personalityTraits?: PersonaCreatepersonalityTraitsInput | string[]
    interests?: PersonaCreateinterestsInput | string[]
    expertise?: PersonaCreateexpertiseInput | string[]
    toneStyle?: $Enums.ToneStyle
    controversyTolerance?: number
    engagementFrequency?: number
    debateAggression?: number
    politicalAlignmentId: string
    aiProvider?: string
    systemPrompt: string
    contextWindow?: number
    postingSchedule: JsonNullValueInput | InputJsonValue
    timezonePreference?: string
    isActive?: boolean
    isDefault?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    posts?: PostUncheckedCreateNestedManyWithoutPersonaInput
  }

  export type PersonaUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    handle?: StringFieldUpdateOperationsInput | string
    bio?: StringFieldUpdateOperationsInput | string
    profileImageUrl?: StringFieldUpdateOperationsInput | string
    personaType?: EnumPersonaTypeFieldUpdateOperationsInput | $Enums.PersonaType
    personalityTraits?: PersonaUpdatepersonalityTraitsInput | string[]
    interests?: PersonaUpdateinterestsInput | string[]
    expertise?: PersonaUpdateexpertiseInput | string[]
    toneStyle?: EnumToneStyleFieldUpdateOperationsInput | $Enums.ToneStyle
    controversyTolerance?: IntFieldUpdateOperationsInput | number
    engagementFrequency?: IntFieldUpdateOperationsInput | number
    debateAggression?: IntFieldUpdateOperationsInput | number
    aiProvider?: StringFieldUpdateOperationsInput | string
    systemPrompt?: StringFieldUpdateOperationsInput | string
    contextWindow?: IntFieldUpdateOperationsInput | number
    postingSchedule?: JsonNullValueInput | InputJsonValue
    timezonePreference?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    politicalAlignment?: PoliticalAlignmentUpdateOneRequiredWithoutPersonasNestedInput
    posts?: PostUpdateManyWithoutPersonaNestedInput
  }

  export type PersonaUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    handle?: StringFieldUpdateOperationsInput | string
    bio?: StringFieldUpdateOperationsInput | string
    profileImageUrl?: StringFieldUpdateOperationsInput | string
    personaType?: EnumPersonaTypeFieldUpdateOperationsInput | $Enums.PersonaType
    personalityTraits?: PersonaUpdatepersonalityTraitsInput | string[]
    interests?: PersonaUpdateinterestsInput | string[]
    expertise?: PersonaUpdateexpertiseInput | string[]
    toneStyle?: EnumToneStyleFieldUpdateOperationsInput | $Enums.ToneStyle
    controversyTolerance?: IntFieldUpdateOperationsInput | number
    engagementFrequency?: IntFieldUpdateOperationsInput | number
    debateAggression?: IntFieldUpdateOperationsInput | number
    politicalAlignmentId?: StringFieldUpdateOperationsInput | string
    aiProvider?: StringFieldUpdateOperationsInput | string
    systemPrompt?: StringFieldUpdateOperationsInput | string
    contextWindow?: IntFieldUpdateOperationsInput | number
    postingSchedule?: JsonNullValueInput | InputJsonValue
    timezonePreference?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    posts?: PostUncheckedUpdateManyWithoutPersonaNestedInput
  }

  export type PersonaCreateManyInput = {
    id?: string
    name: string
    handle: string
    bio: string
    profileImageUrl: string
    personaType: $Enums.PersonaType
    personalityTraits?: PersonaCreatepersonalityTraitsInput | string[]
    interests?: PersonaCreateinterestsInput | string[]
    expertise?: PersonaCreateexpertiseInput | string[]
    toneStyle?: $Enums.ToneStyle
    controversyTolerance?: number
    engagementFrequency?: number
    debateAggression?: number
    politicalAlignmentId: string
    aiProvider?: string
    systemPrompt: string
    contextWindow?: number
    postingSchedule: JsonNullValueInput | InputJsonValue
    timezonePreference?: string
    isActive?: boolean
    isDefault?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PersonaUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    handle?: StringFieldUpdateOperationsInput | string
    bio?: StringFieldUpdateOperationsInput | string
    profileImageUrl?: StringFieldUpdateOperationsInput | string
    personaType?: EnumPersonaTypeFieldUpdateOperationsInput | $Enums.PersonaType
    personalityTraits?: PersonaUpdatepersonalityTraitsInput | string[]
    interests?: PersonaUpdateinterestsInput | string[]
    expertise?: PersonaUpdateexpertiseInput | string[]
    toneStyle?: EnumToneStyleFieldUpdateOperationsInput | $Enums.ToneStyle
    controversyTolerance?: IntFieldUpdateOperationsInput | number
    engagementFrequency?: IntFieldUpdateOperationsInput | number
    debateAggression?: IntFieldUpdateOperationsInput | number
    aiProvider?: StringFieldUpdateOperationsInput | string
    systemPrompt?: StringFieldUpdateOperationsInput | string
    contextWindow?: IntFieldUpdateOperationsInput | number
    postingSchedule?: JsonNullValueInput | InputJsonValue
    timezonePreference?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PersonaUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    handle?: StringFieldUpdateOperationsInput | string
    bio?: StringFieldUpdateOperationsInput | string
    profileImageUrl?: StringFieldUpdateOperationsInput | string
    personaType?: EnumPersonaTypeFieldUpdateOperationsInput | $Enums.PersonaType
    personalityTraits?: PersonaUpdatepersonalityTraitsInput | string[]
    interests?: PersonaUpdateinterestsInput | string[]
    expertise?: PersonaUpdateexpertiseInput | string[]
    toneStyle?: EnumToneStyleFieldUpdateOperationsInput | $Enums.ToneStyle
    controversyTolerance?: IntFieldUpdateOperationsInput | number
    engagementFrequency?: IntFieldUpdateOperationsInput | number
    debateAggression?: IntFieldUpdateOperationsInput | number
    politicalAlignmentId?: StringFieldUpdateOperationsInput | string
    aiProvider?: StringFieldUpdateOperationsInput | string
    systemPrompt?: StringFieldUpdateOperationsInput | string
    contextWindow?: IntFieldUpdateOperationsInput | number
    postingSchedule?: JsonNullValueInput | InputJsonValue
    timezonePreference?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NewsItemCreateInput = {
    id?: string
    title: string
    description: string
    content?: string | null
    url: string
    sourceName: string
    sourceUrl: string
    author?: string | null
    category?: $Enums.NewsCategory
    topics?: NewsItemCreatetopicsInput | string[]
    keywords?: NewsItemCreatekeywordsInput | string[]
    entities?: NewsItemCreateentitiesInput | string[]
    country?: string | null
    region?: string | null
    language?: string
    sentimentScore?: number
    impactScore?: number
    controversyScore?: number
    publishedAt: Date | string
    discoveredAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    aiSummary?: string | null
    topicTags?: NewsItemCreatetopicTagsInput | string[]
    trends?: TrendCreateNestedManyWithoutNewsItemsInput
    relatedPosts?: PostCreateNestedManyWithoutNewsItemInput
  }

  export type NewsItemUncheckedCreateInput = {
    id?: string
    title: string
    description: string
    content?: string | null
    url: string
    sourceName: string
    sourceUrl: string
    author?: string | null
    category?: $Enums.NewsCategory
    topics?: NewsItemCreatetopicsInput | string[]
    keywords?: NewsItemCreatekeywordsInput | string[]
    entities?: NewsItemCreateentitiesInput | string[]
    country?: string | null
    region?: string | null
    language?: string
    sentimentScore?: number
    impactScore?: number
    controversyScore?: number
    publishedAt: Date | string
    discoveredAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    aiSummary?: string | null
    topicTags?: NewsItemCreatetopicTagsInput | string[]
    trends?: TrendUncheckedCreateNestedManyWithoutNewsItemsInput
    relatedPosts?: PostUncheckedCreateNestedManyWithoutNewsItemInput
  }

  export type NewsItemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    url?: StringFieldUpdateOperationsInput | string
    sourceName?: StringFieldUpdateOperationsInput | string
    sourceUrl?: StringFieldUpdateOperationsInput | string
    author?: NullableStringFieldUpdateOperationsInput | string | null
    category?: EnumNewsCategoryFieldUpdateOperationsInput | $Enums.NewsCategory
    topics?: NewsItemUpdatetopicsInput | string[]
    keywords?: NewsItemUpdatekeywordsInput | string[]
    entities?: NewsItemUpdateentitiesInput | string[]
    country?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    language?: StringFieldUpdateOperationsInput | string
    sentimentScore?: FloatFieldUpdateOperationsInput | number
    impactScore?: IntFieldUpdateOperationsInput | number
    controversyScore?: IntFieldUpdateOperationsInput | number
    publishedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    discoveredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    aiSummary?: NullableStringFieldUpdateOperationsInput | string | null
    topicTags?: NewsItemUpdatetopicTagsInput | string[]
    trends?: TrendUpdateManyWithoutNewsItemsNestedInput
    relatedPosts?: PostUpdateManyWithoutNewsItemNestedInput
  }

  export type NewsItemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    url?: StringFieldUpdateOperationsInput | string
    sourceName?: StringFieldUpdateOperationsInput | string
    sourceUrl?: StringFieldUpdateOperationsInput | string
    author?: NullableStringFieldUpdateOperationsInput | string | null
    category?: EnumNewsCategoryFieldUpdateOperationsInput | $Enums.NewsCategory
    topics?: NewsItemUpdatetopicsInput | string[]
    keywords?: NewsItemUpdatekeywordsInput | string[]
    entities?: NewsItemUpdateentitiesInput | string[]
    country?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    language?: StringFieldUpdateOperationsInput | string
    sentimentScore?: FloatFieldUpdateOperationsInput | number
    impactScore?: IntFieldUpdateOperationsInput | number
    controversyScore?: IntFieldUpdateOperationsInput | number
    publishedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    discoveredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    aiSummary?: NullableStringFieldUpdateOperationsInput | string | null
    topicTags?: NewsItemUpdatetopicTagsInput | string[]
    trends?: TrendUncheckedUpdateManyWithoutNewsItemsNestedInput
    relatedPosts?: PostUncheckedUpdateManyWithoutNewsItemNestedInput
  }

  export type NewsItemCreateManyInput = {
    id?: string
    title: string
    description: string
    content?: string | null
    url: string
    sourceName: string
    sourceUrl: string
    author?: string | null
    category?: $Enums.NewsCategory
    topics?: NewsItemCreatetopicsInput | string[]
    keywords?: NewsItemCreatekeywordsInput | string[]
    entities?: NewsItemCreateentitiesInput | string[]
    country?: string | null
    region?: string | null
    language?: string
    sentimentScore?: number
    impactScore?: number
    controversyScore?: number
    publishedAt: Date | string
    discoveredAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    aiSummary?: string | null
    topicTags?: NewsItemCreatetopicTagsInput | string[]
  }

  export type NewsItemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    url?: StringFieldUpdateOperationsInput | string
    sourceName?: StringFieldUpdateOperationsInput | string
    sourceUrl?: StringFieldUpdateOperationsInput | string
    author?: NullableStringFieldUpdateOperationsInput | string | null
    category?: EnumNewsCategoryFieldUpdateOperationsInput | $Enums.NewsCategory
    topics?: NewsItemUpdatetopicsInput | string[]
    keywords?: NewsItemUpdatekeywordsInput | string[]
    entities?: NewsItemUpdateentitiesInput | string[]
    country?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    language?: StringFieldUpdateOperationsInput | string
    sentimentScore?: FloatFieldUpdateOperationsInput | number
    impactScore?: IntFieldUpdateOperationsInput | number
    controversyScore?: IntFieldUpdateOperationsInput | number
    publishedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    discoveredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    aiSummary?: NullableStringFieldUpdateOperationsInput | string | null
    topicTags?: NewsItemUpdatetopicTagsInput | string[]
  }

  export type NewsItemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    url?: StringFieldUpdateOperationsInput | string
    sourceName?: StringFieldUpdateOperationsInput | string
    sourceUrl?: StringFieldUpdateOperationsInput | string
    author?: NullableStringFieldUpdateOperationsInput | string | null
    category?: EnumNewsCategoryFieldUpdateOperationsInput | $Enums.NewsCategory
    topics?: NewsItemUpdatetopicsInput | string[]
    keywords?: NewsItemUpdatekeywordsInput | string[]
    entities?: NewsItemUpdateentitiesInput | string[]
    country?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    language?: StringFieldUpdateOperationsInput | string
    sentimentScore?: FloatFieldUpdateOperationsInput | number
    impactScore?: IntFieldUpdateOperationsInput | number
    controversyScore?: IntFieldUpdateOperationsInput | number
    publishedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    discoveredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    aiSummary?: NullableStringFieldUpdateOperationsInput | string | null
    topicTags?: NewsItemUpdatetopicTagsInput | string[]
  }

  export type TrendCreateInput = {
    id?: string
    hashtag?: string | null
    keyword?: string | null
    topic: string
    postCount?: number
    uniqueUsers?: number
    impressionCount?: number
    engagementCount?: number
    trendScore?: number
    velocity?: number
    peakTime?: Date | string | null
    category?: $Enums.TrendCategory
    region?: string | null
    language?: string
    isPromoted?: boolean
    isHidden?: boolean
    startedAt?: Date | string
    endedAt?: Date | string | null
    lastUpdated?: Date | string
    createdAt?: Date | string
    newsItems?: NewsItemCreateNestedManyWithoutTrendsInput
  }

  export type TrendUncheckedCreateInput = {
    id?: string
    hashtag?: string | null
    keyword?: string | null
    topic: string
    postCount?: number
    uniqueUsers?: number
    impressionCount?: number
    engagementCount?: number
    trendScore?: number
    velocity?: number
    peakTime?: Date | string | null
    category?: $Enums.TrendCategory
    region?: string | null
    language?: string
    isPromoted?: boolean
    isHidden?: boolean
    startedAt?: Date | string
    endedAt?: Date | string | null
    lastUpdated?: Date | string
    createdAt?: Date | string
    newsItems?: NewsItemUncheckedCreateNestedManyWithoutTrendsInput
  }

  export type TrendUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    hashtag?: NullableStringFieldUpdateOperationsInput | string | null
    keyword?: NullableStringFieldUpdateOperationsInput | string | null
    topic?: StringFieldUpdateOperationsInput | string
    postCount?: IntFieldUpdateOperationsInput | number
    uniqueUsers?: IntFieldUpdateOperationsInput | number
    impressionCount?: IntFieldUpdateOperationsInput | number
    engagementCount?: IntFieldUpdateOperationsInput | number
    trendScore?: IntFieldUpdateOperationsInput | number
    velocity?: FloatFieldUpdateOperationsInput | number
    peakTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    category?: EnumTrendCategoryFieldUpdateOperationsInput | $Enums.TrendCategory
    region?: NullableStringFieldUpdateOperationsInput | string | null
    language?: StringFieldUpdateOperationsInput | string
    isPromoted?: BoolFieldUpdateOperationsInput | boolean
    isHidden?: BoolFieldUpdateOperationsInput | boolean
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    newsItems?: NewsItemUpdateManyWithoutTrendsNestedInput
  }

  export type TrendUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    hashtag?: NullableStringFieldUpdateOperationsInput | string | null
    keyword?: NullableStringFieldUpdateOperationsInput | string | null
    topic?: StringFieldUpdateOperationsInput | string
    postCount?: IntFieldUpdateOperationsInput | number
    uniqueUsers?: IntFieldUpdateOperationsInput | number
    impressionCount?: IntFieldUpdateOperationsInput | number
    engagementCount?: IntFieldUpdateOperationsInput | number
    trendScore?: IntFieldUpdateOperationsInput | number
    velocity?: FloatFieldUpdateOperationsInput | number
    peakTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    category?: EnumTrendCategoryFieldUpdateOperationsInput | $Enums.TrendCategory
    region?: NullableStringFieldUpdateOperationsInput | string | null
    language?: StringFieldUpdateOperationsInput | string
    isPromoted?: BoolFieldUpdateOperationsInput | boolean
    isHidden?: BoolFieldUpdateOperationsInput | boolean
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    newsItems?: NewsItemUncheckedUpdateManyWithoutTrendsNestedInput
  }

  export type TrendCreateManyInput = {
    id?: string
    hashtag?: string | null
    keyword?: string | null
    topic: string
    postCount?: number
    uniqueUsers?: number
    impressionCount?: number
    engagementCount?: number
    trendScore?: number
    velocity?: number
    peakTime?: Date | string | null
    category?: $Enums.TrendCategory
    region?: string | null
    language?: string
    isPromoted?: boolean
    isHidden?: boolean
    startedAt?: Date | string
    endedAt?: Date | string | null
    lastUpdated?: Date | string
    createdAt?: Date | string
  }

  export type TrendUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    hashtag?: NullableStringFieldUpdateOperationsInput | string | null
    keyword?: NullableStringFieldUpdateOperationsInput | string | null
    topic?: StringFieldUpdateOperationsInput | string
    postCount?: IntFieldUpdateOperationsInput | number
    uniqueUsers?: IntFieldUpdateOperationsInput | number
    impressionCount?: IntFieldUpdateOperationsInput | number
    engagementCount?: IntFieldUpdateOperationsInput | number
    trendScore?: IntFieldUpdateOperationsInput | number
    velocity?: FloatFieldUpdateOperationsInput | number
    peakTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    category?: EnumTrendCategoryFieldUpdateOperationsInput | $Enums.TrendCategory
    region?: NullableStringFieldUpdateOperationsInput | string | null
    language?: StringFieldUpdateOperationsInput | string
    isPromoted?: BoolFieldUpdateOperationsInput | boolean
    isHidden?: BoolFieldUpdateOperationsInput | boolean
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TrendUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    hashtag?: NullableStringFieldUpdateOperationsInput | string | null
    keyword?: NullableStringFieldUpdateOperationsInput | string | null
    topic?: StringFieldUpdateOperationsInput | string
    postCount?: IntFieldUpdateOperationsInput | number
    uniqueUsers?: IntFieldUpdateOperationsInput | number
    impressionCount?: IntFieldUpdateOperationsInput | number
    engagementCount?: IntFieldUpdateOperationsInput | number
    trendScore?: IntFieldUpdateOperationsInput | number
    velocity?: FloatFieldUpdateOperationsInput | number
    peakTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    category?: EnumTrendCategoryFieldUpdateOperationsInput | $Enums.TrendCategory
    region?: NullableStringFieldUpdateOperationsInput | string | null
    language?: StringFieldUpdateOperationsInput | string
    isPromoted?: BoolFieldUpdateOperationsInput | boolean
    isHidden?: BoolFieldUpdateOperationsInput | boolean
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type UserProfileNullableRelationFilter = {
    is?: UserProfileWhereInput | null
    isNot?: UserProfileWhereInput | null
  }

  export type PoliticalAlignmentNullableRelationFilter = {
    is?: PoliticalAlignmentWhereInput | null
    isNot?: PoliticalAlignmentWhereInput | null
  }

  export type InfluenceMetricsNullableRelationFilter = {
    is?: InfluenceMetricsWhereInput | null
    isNot?: InfluenceMetricsWhereInput | null
  }

  export type SettingsNullableRelationFilter = {
    is?: SettingsWhereInput | null
    isNot?: SettingsWhereInput | null
  }

  export type PostListRelationFilter = {
    every?: PostWhereInput
    some?: PostWhereInput
    none?: PostWhereInput
  }

  export type ReactionListRelationFilter = {
    every?: ReactionWhereInput
    some?: ReactionWhereInput
    none?: ReactionWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type PostOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ReactionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserAccountCountOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    emailVerified?: SortOrder
    isActive?: SortOrder
    lastLoginAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserAccountMaxOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    emailVerified?: SortOrder
    isActive?: SortOrder
    lastLoginAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserAccountMinOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    emailVerified?: SortOrder
    isActive?: SortOrder
    lastLoginAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type EnumPersonaTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.PersonaType | EnumPersonaTypeFieldRefInput<$PrismaModel>
    in?: $Enums.PersonaType[] | ListEnumPersonaTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.PersonaType[] | ListEnumPersonaTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumPersonaTypeFilter<$PrismaModel> | $Enums.PersonaType
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type UserAccountRelationFilter = {
    is?: UserAccountWhereInput
    isNot?: UserAccountWhereInput
  }

  export type UserProfileCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    displayName?: SortOrder
    bio?: SortOrder
    profileImageUrl?: SortOrder
    headerImageUrl?: SortOrder
    location?: SortOrder
    website?: SortOrder
    personaType?: SortOrder
    specialtyAreas?: SortOrder
    verificationBadge?: SortOrder
    followerCount?: SortOrder
    followingCount?: SortOrder
    postCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserProfileAvgOrderByAggregateInput = {
    followerCount?: SortOrder
    followingCount?: SortOrder
    postCount?: SortOrder
  }

  export type UserProfileMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    displayName?: SortOrder
    bio?: SortOrder
    profileImageUrl?: SortOrder
    headerImageUrl?: SortOrder
    location?: SortOrder
    website?: SortOrder
    personaType?: SortOrder
    verificationBadge?: SortOrder
    followerCount?: SortOrder
    followingCount?: SortOrder
    postCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserProfileMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    displayName?: SortOrder
    bio?: SortOrder
    profileImageUrl?: SortOrder
    headerImageUrl?: SortOrder
    location?: SortOrder
    website?: SortOrder
    personaType?: SortOrder
    verificationBadge?: SortOrder
    followerCount?: SortOrder
    followingCount?: SortOrder
    postCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserProfileSumOrderByAggregateInput = {
    followerCount?: SortOrder
    followingCount?: SortOrder
    postCount?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EnumPersonaTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PersonaType | EnumPersonaTypeFieldRefInput<$PrismaModel>
    in?: $Enums.PersonaType[] | ListEnumPersonaTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.PersonaType[] | ListEnumPersonaTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumPersonaTypeWithAggregatesFilter<$PrismaModel> | $Enums.PersonaType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPersonaTypeFilter<$PrismaModel>
    _max?: NestedEnumPersonaTypeFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type PersonaListRelationFilter = {
    every?: PersonaWhereInput
    some?: PersonaWhereInput
    none?: PersonaWhereInput
  }

  export type PersonaOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PoliticalAlignmentCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    economicPosition?: SortOrder
    socialPosition?: SortOrder
    primaryIssues?: SortOrder
    partyAffiliation?: SortOrder
    ideologyTags?: SortOrder
    debateWillingness?: SortOrder
    controversyTolerance?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PoliticalAlignmentAvgOrderByAggregateInput = {
    economicPosition?: SortOrder
    socialPosition?: SortOrder
    debateWillingness?: SortOrder
    controversyTolerance?: SortOrder
  }

  export type PoliticalAlignmentMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    economicPosition?: SortOrder
    socialPosition?: SortOrder
    partyAffiliation?: SortOrder
    debateWillingness?: SortOrder
    controversyTolerance?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PoliticalAlignmentMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    economicPosition?: SortOrder
    socialPosition?: SortOrder
    partyAffiliation?: SortOrder
    debateWillingness?: SortOrder
    controversyTolerance?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PoliticalAlignmentSumOrderByAggregateInput = {
    economicPosition?: SortOrder
    socialPosition?: SortOrder
    debateWillingness?: SortOrder
    controversyTolerance?: SortOrder
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type InfluenceMetricsCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    followerCount?: SortOrder
    followingCount?: SortOrder
    engagementRate?: SortOrder
    reachScore?: SortOrder
    approvalRating?: SortOrder
    controversyLevel?: SortOrder
    trendingScore?: SortOrder
    followerGrowthDaily?: SortOrder
    followerGrowthWeekly?: SortOrder
    followerGrowthMonthly?: SortOrder
    totalLikes?: SortOrder
    totalReshares?: SortOrder
    totalComments?: SortOrder
    influenceRank?: SortOrder
    categoryRank?: SortOrder
    lastUpdated?: SortOrder
    createdAt?: SortOrder
  }

  export type InfluenceMetricsAvgOrderByAggregateInput = {
    followerCount?: SortOrder
    followingCount?: SortOrder
    engagementRate?: SortOrder
    reachScore?: SortOrder
    approvalRating?: SortOrder
    controversyLevel?: SortOrder
    trendingScore?: SortOrder
    followerGrowthDaily?: SortOrder
    followerGrowthWeekly?: SortOrder
    followerGrowthMonthly?: SortOrder
    totalLikes?: SortOrder
    totalReshares?: SortOrder
    totalComments?: SortOrder
    influenceRank?: SortOrder
    categoryRank?: SortOrder
  }

  export type InfluenceMetricsMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    followerCount?: SortOrder
    followingCount?: SortOrder
    engagementRate?: SortOrder
    reachScore?: SortOrder
    approvalRating?: SortOrder
    controversyLevel?: SortOrder
    trendingScore?: SortOrder
    followerGrowthDaily?: SortOrder
    followerGrowthWeekly?: SortOrder
    followerGrowthMonthly?: SortOrder
    totalLikes?: SortOrder
    totalReshares?: SortOrder
    totalComments?: SortOrder
    influenceRank?: SortOrder
    categoryRank?: SortOrder
    lastUpdated?: SortOrder
    createdAt?: SortOrder
  }

  export type InfluenceMetricsMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    followerCount?: SortOrder
    followingCount?: SortOrder
    engagementRate?: SortOrder
    reachScore?: SortOrder
    approvalRating?: SortOrder
    controversyLevel?: SortOrder
    trendingScore?: SortOrder
    followerGrowthDaily?: SortOrder
    followerGrowthWeekly?: SortOrder
    followerGrowthMonthly?: SortOrder
    totalLikes?: SortOrder
    totalReshares?: SortOrder
    totalComments?: SortOrder
    influenceRank?: SortOrder
    categoryRank?: SortOrder
    lastUpdated?: SortOrder
    createdAt?: SortOrder
  }

  export type InfluenceMetricsSumOrderByAggregateInput = {
    followerCount?: SortOrder
    followingCount?: SortOrder
    engagementRate?: SortOrder
    reachScore?: SortOrder
    approvalRating?: SortOrder
    controversyLevel?: SortOrder
    trendingScore?: SortOrder
    followerGrowthDaily?: SortOrder
    followerGrowthWeekly?: SortOrder
    followerGrowthMonthly?: SortOrder
    totalLikes?: SortOrder
    totalReshares?: SortOrder
    totalComments?: SortOrder
    influenceRank?: SortOrder
    categoryRank?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type EnumNewsCategoryNullableListFilter<$PrismaModel = never> = {
    equals?: $Enums.NewsCategory[] | ListEnumNewsCategoryFieldRefInput<$PrismaModel> | null
    has?: $Enums.NewsCategory | EnumNewsCategoryFieldRefInput<$PrismaModel> | null
    hasEvery?: $Enums.NewsCategory[] | ListEnumNewsCategoryFieldRefInput<$PrismaModel>
    hasSome?: $Enums.NewsCategory[] | ListEnumNewsCategoryFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type EnumToneStyleFilter<$PrismaModel = never> = {
    equals?: $Enums.ToneStyle | EnumToneStyleFieldRefInput<$PrismaModel>
    in?: $Enums.ToneStyle[] | ListEnumToneStyleFieldRefInput<$PrismaModel>
    notIn?: $Enums.ToneStyle[] | ListEnumToneStyleFieldRefInput<$PrismaModel>
    not?: NestedEnumToneStyleFilter<$PrismaModel> | $Enums.ToneStyle
  }

  export type EnumNotificationCategoryNullableListFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationCategory[] | ListEnumNotificationCategoryFieldRefInput<$PrismaModel> | null
    has?: $Enums.NotificationCategory | EnumNotificationCategoryFieldRefInput<$PrismaModel> | null
    hasEvery?: $Enums.NotificationCategory[] | ListEnumNotificationCategoryFieldRefInput<$PrismaModel>
    hasSome?: $Enums.NotificationCategory[] | ListEnumNotificationCategoryFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type EnumProfileVisibilityFilter<$PrismaModel = never> = {
    equals?: $Enums.ProfileVisibility | EnumProfileVisibilityFieldRefInput<$PrismaModel>
    in?: $Enums.ProfileVisibility[] | ListEnumProfileVisibilityFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProfileVisibility[] | ListEnumProfileVisibilityFieldRefInput<$PrismaModel>
    not?: NestedEnumProfileVisibilityFilter<$PrismaModel> | $Enums.ProfileVisibility
  }

  export type EnumThemeFilter<$PrismaModel = never> = {
    equals?: $Enums.Theme | EnumThemeFieldRefInput<$PrismaModel>
    in?: $Enums.Theme[] | ListEnumThemeFieldRefInput<$PrismaModel>
    notIn?: $Enums.Theme[] | ListEnumThemeFieldRefInput<$PrismaModel>
    not?: NestedEnumThemeFilter<$PrismaModel> | $Enums.Theme
  }

  export type SettingsCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    newsRegion?: SortOrder
    newsCategories?: SortOrder
    newsLanguages?: SortOrder
    aiChatterLevel?: SortOrder
    aiPersonalities?: SortOrder
    aiResponseTone?: SortOrder
    emailNotifications?: SortOrder
    pushNotifications?: SortOrder
    notificationCategories?: SortOrder
    profileVisibility?: SortOrder
    allowPersonaInteractions?: SortOrder
    allowDataForAI?: SortOrder
    theme?: SortOrder
    language?: SortOrder
    timezone?: SortOrder
    customAIApiKey?: SortOrder
    customAIBaseUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SettingsAvgOrderByAggregateInput = {
    aiChatterLevel?: SortOrder
  }

  export type SettingsMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    newsRegion?: SortOrder
    aiChatterLevel?: SortOrder
    aiResponseTone?: SortOrder
    emailNotifications?: SortOrder
    pushNotifications?: SortOrder
    profileVisibility?: SortOrder
    allowPersonaInteractions?: SortOrder
    allowDataForAI?: SortOrder
    theme?: SortOrder
    language?: SortOrder
    timezone?: SortOrder
    customAIApiKey?: SortOrder
    customAIBaseUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SettingsMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    newsRegion?: SortOrder
    aiChatterLevel?: SortOrder
    aiResponseTone?: SortOrder
    emailNotifications?: SortOrder
    pushNotifications?: SortOrder
    profileVisibility?: SortOrder
    allowPersonaInteractions?: SortOrder
    allowDataForAI?: SortOrder
    theme?: SortOrder
    language?: SortOrder
    timezone?: SortOrder
    customAIApiKey?: SortOrder
    customAIBaseUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SettingsSumOrderByAggregateInput = {
    aiChatterLevel?: SortOrder
  }

  export type EnumToneStyleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ToneStyle | EnumToneStyleFieldRefInput<$PrismaModel>
    in?: $Enums.ToneStyle[] | ListEnumToneStyleFieldRefInput<$PrismaModel>
    notIn?: $Enums.ToneStyle[] | ListEnumToneStyleFieldRefInput<$PrismaModel>
    not?: NestedEnumToneStyleWithAggregatesFilter<$PrismaModel> | $Enums.ToneStyle
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumToneStyleFilter<$PrismaModel>
    _max?: NestedEnumToneStyleFilter<$PrismaModel>
  }

  export type EnumProfileVisibilityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ProfileVisibility | EnumProfileVisibilityFieldRefInput<$PrismaModel>
    in?: $Enums.ProfileVisibility[] | ListEnumProfileVisibilityFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProfileVisibility[] | ListEnumProfileVisibilityFieldRefInput<$PrismaModel>
    not?: NestedEnumProfileVisibilityWithAggregatesFilter<$PrismaModel> | $Enums.ProfileVisibility
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumProfileVisibilityFilter<$PrismaModel>
    _max?: NestedEnumProfileVisibilityFilter<$PrismaModel>
  }

  export type EnumThemeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Theme | EnumThemeFieldRefInput<$PrismaModel>
    in?: $Enums.Theme[] | ListEnumThemeFieldRefInput<$PrismaModel>
    notIn?: $Enums.Theme[] | ListEnumThemeFieldRefInput<$PrismaModel>
    not?: NestedEnumThemeWithAggregatesFilter<$PrismaModel> | $Enums.Theme
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumThemeFilter<$PrismaModel>
    _max?: NestedEnumThemeFilter<$PrismaModel>
  }
  export type JsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type PersonaNullableRelationFilter = {
    is?: PersonaWhereInput | null
    isNot?: PersonaWhereInput | null
  }

  export type ThreadRelationFilter = {
    is?: ThreadWhereInput
    isNot?: ThreadWhereInput
  }

  export type PostNullableRelationFilter = {
    is?: PostWhereInput | null
    isNot?: PostWhereInput | null
  }

  export type NewsItemNullableRelationFilter = {
    is?: NewsItemWhereInput | null
    isNot?: NewsItemWhereInput | null
  }

  export type PostCountOrderByAggregateInput = {
    id?: SortOrder
    authorId?: SortOrder
    personaId?: SortOrder
    content?: SortOrder
    mediaUrls?: SortOrder
    linkPreview?: SortOrder
    threadId?: SortOrder
    parentPostId?: SortOrder
    repostOfId?: SortOrder
    isAIGenerated?: SortOrder
    hashtags?: SortOrder
    mentions?: SortOrder
    newsItemId?: SortOrder
    newsContext?: SortOrder
    likeCount?: SortOrder
    repostCount?: SortOrder
    commentCount?: SortOrder
    impressionCount?: SortOrder
    contentWarning?: SortOrder
    isHidden?: SortOrder
    reportCount?: SortOrder
    publishedAt?: SortOrder
    editedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PostAvgOrderByAggregateInput = {
    likeCount?: SortOrder
    repostCount?: SortOrder
    commentCount?: SortOrder
    impressionCount?: SortOrder
    reportCount?: SortOrder
  }

  export type PostMaxOrderByAggregateInput = {
    id?: SortOrder
    authorId?: SortOrder
    personaId?: SortOrder
    content?: SortOrder
    threadId?: SortOrder
    parentPostId?: SortOrder
    repostOfId?: SortOrder
    isAIGenerated?: SortOrder
    newsItemId?: SortOrder
    newsContext?: SortOrder
    likeCount?: SortOrder
    repostCount?: SortOrder
    commentCount?: SortOrder
    impressionCount?: SortOrder
    contentWarning?: SortOrder
    isHidden?: SortOrder
    reportCount?: SortOrder
    publishedAt?: SortOrder
    editedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PostMinOrderByAggregateInput = {
    id?: SortOrder
    authorId?: SortOrder
    personaId?: SortOrder
    content?: SortOrder
    threadId?: SortOrder
    parentPostId?: SortOrder
    repostOfId?: SortOrder
    isAIGenerated?: SortOrder
    newsItemId?: SortOrder
    newsContext?: SortOrder
    likeCount?: SortOrder
    repostCount?: SortOrder
    commentCount?: SortOrder
    impressionCount?: SortOrder
    contentWarning?: SortOrder
    isHidden?: SortOrder
    reportCount?: SortOrder
    publishedAt?: SortOrder
    editedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PostSumOrderByAggregateInput = {
    likeCount?: SortOrder
    repostCount?: SortOrder
    commentCount?: SortOrder
    impressionCount?: SortOrder
    reportCount?: SortOrder
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type ThreadCountOrderByAggregateInput = {
    id?: SortOrder
    originalPostId?: SortOrder
    title?: SortOrder
    participantCount?: SortOrder
    postCount?: SortOrder
    maxDepth?: SortOrder
    totalLikes?: SortOrder
    totalReshares?: SortOrder
    lastActivityAt?: SortOrder
    isLocked?: SortOrder
    isHidden?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ThreadAvgOrderByAggregateInput = {
    participantCount?: SortOrder
    postCount?: SortOrder
    maxDepth?: SortOrder
    totalLikes?: SortOrder
    totalReshares?: SortOrder
  }

  export type ThreadMaxOrderByAggregateInput = {
    id?: SortOrder
    originalPostId?: SortOrder
    title?: SortOrder
    participantCount?: SortOrder
    postCount?: SortOrder
    maxDepth?: SortOrder
    totalLikes?: SortOrder
    totalReshares?: SortOrder
    lastActivityAt?: SortOrder
    isLocked?: SortOrder
    isHidden?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ThreadMinOrderByAggregateInput = {
    id?: SortOrder
    originalPostId?: SortOrder
    title?: SortOrder
    participantCount?: SortOrder
    postCount?: SortOrder
    maxDepth?: SortOrder
    totalLikes?: SortOrder
    totalReshares?: SortOrder
    lastActivityAt?: SortOrder
    isLocked?: SortOrder
    isHidden?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ThreadSumOrderByAggregateInput = {
    participantCount?: SortOrder
    postCount?: SortOrder
    maxDepth?: SortOrder
    totalLikes?: SortOrder
    totalReshares?: SortOrder
  }

  export type EnumReactionTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.ReactionType | EnumReactionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ReactionType[] | ListEnumReactionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ReactionType[] | ListEnumReactionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumReactionTypeFilter<$PrismaModel> | $Enums.ReactionType
  }

  export type PostRelationFilter = {
    is?: PostWhereInput
    isNot?: PostWhereInput
  }

  export type ReactionUnique_user_post_reactionCompoundUniqueInput = {
    userId: string
    postId: string
    type: $Enums.ReactionType
  }

  export type ReactionCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    postId?: SortOrder
    type?: SortOrder
    createdAt?: SortOrder
  }

  export type ReactionMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    postId?: SortOrder
    type?: SortOrder
    createdAt?: SortOrder
  }

  export type ReactionMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    postId?: SortOrder
    type?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumReactionTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ReactionType | EnumReactionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ReactionType[] | ListEnumReactionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ReactionType[] | ListEnumReactionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumReactionTypeWithAggregatesFilter<$PrismaModel> | $Enums.ReactionType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumReactionTypeFilter<$PrismaModel>
    _max?: NestedEnumReactionTypeFilter<$PrismaModel>
  }
  export type JsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type PoliticalAlignmentRelationFilter = {
    is?: PoliticalAlignmentWhereInput
    isNot?: PoliticalAlignmentWhereInput
  }

  export type PersonaCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    handle?: SortOrder
    bio?: SortOrder
    profileImageUrl?: SortOrder
    personaType?: SortOrder
    personalityTraits?: SortOrder
    interests?: SortOrder
    expertise?: SortOrder
    toneStyle?: SortOrder
    controversyTolerance?: SortOrder
    engagementFrequency?: SortOrder
    debateAggression?: SortOrder
    politicalAlignmentId?: SortOrder
    aiProvider?: SortOrder
    systemPrompt?: SortOrder
    contextWindow?: SortOrder
    postingSchedule?: SortOrder
    timezonePreference?: SortOrder
    isActive?: SortOrder
    isDefault?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PersonaAvgOrderByAggregateInput = {
    controversyTolerance?: SortOrder
    engagementFrequency?: SortOrder
    debateAggression?: SortOrder
    contextWindow?: SortOrder
  }

  export type PersonaMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    handle?: SortOrder
    bio?: SortOrder
    profileImageUrl?: SortOrder
    personaType?: SortOrder
    toneStyle?: SortOrder
    controversyTolerance?: SortOrder
    engagementFrequency?: SortOrder
    debateAggression?: SortOrder
    politicalAlignmentId?: SortOrder
    aiProvider?: SortOrder
    systemPrompt?: SortOrder
    contextWindow?: SortOrder
    timezonePreference?: SortOrder
    isActive?: SortOrder
    isDefault?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PersonaMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    handle?: SortOrder
    bio?: SortOrder
    profileImageUrl?: SortOrder
    personaType?: SortOrder
    toneStyle?: SortOrder
    controversyTolerance?: SortOrder
    engagementFrequency?: SortOrder
    debateAggression?: SortOrder
    politicalAlignmentId?: SortOrder
    aiProvider?: SortOrder
    systemPrompt?: SortOrder
    contextWindow?: SortOrder
    timezonePreference?: SortOrder
    isActive?: SortOrder
    isDefault?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PersonaSumOrderByAggregateInput = {
    controversyTolerance?: SortOrder
    engagementFrequency?: SortOrder
    debateAggression?: SortOrder
    contextWindow?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type EnumNewsCategoryFilter<$PrismaModel = never> = {
    equals?: $Enums.NewsCategory | EnumNewsCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.NewsCategory[] | ListEnumNewsCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.NewsCategory[] | ListEnumNewsCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumNewsCategoryFilter<$PrismaModel> | $Enums.NewsCategory
  }

  export type TrendListRelationFilter = {
    every?: TrendWhereInput
    some?: TrendWhereInput
    none?: TrendWhereInput
  }

  export type TrendOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type NewsItemCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    content?: SortOrder
    url?: SortOrder
    sourceName?: SortOrder
    sourceUrl?: SortOrder
    author?: SortOrder
    category?: SortOrder
    topics?: SortOrder
    keywords?: SortOrder
    entities?: SortOrder
    country?: SortOrder
    region?: SortOrder
    language?: SortOrder
    sentimentScore?: SortOrder
    impactScore?: SortOrder
    controversyScore?: SortOrder
    publishedAt?: SortOrder
    discoveredAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    aiSummary?: SortOrder
    topicTags?: SortOrder
  }

  export type NewsItemAvgOrderByAggregateInput = {
    sentimentScore?: SortOrder
    impactScore?: SortOrder
    controversyScore?: SortOrder
  }

  export type NewsItemMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    content?: SortOrder
    url?: SortOrder
    sourceName?: SortOrder
    sourceUrl?: SortOrder
    author?: SortOrder
    category?: SortOrder
    country?: SortOrder
    region?: SortOrder
    language?: SortOrder
    sentimentScore?: SortOrder
    impactScore?: SortOrder
    controversyScore?: SortOrder
    publishedAt?: SortOrder
    discoveredAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    aiSummary?: SortOrder
  }

  export type NewsItemMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    content?: SortOrder
    url?: SortOrder
    sourceName?: SortOrder
    sourceUrl?: SortOrder
    author?: SortOrder
    category?: SortOrder
    country?: SortOrder
    region?: SortOrder
    language?: SortOrder
    sentimentScore?: SortOrder
    impactScore?: SortOrder
    controversyScore?: SortOrder
    publishedAt?: SortOrder
    discoveredAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    aiSummary?: SortOrder
  }

  export type NewsItemSumOrderByAggregateInput = {
    sentimentScore?: SortOrder
    impactScore?: SortOrder
    controversyScore?: SortOrder
  }

  export type EnumNewsCategoryWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NewsCategory | EnumNewsCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.NewsCategory[] | ListEnumNewsCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.NewsCategory[] | ListEnumNewsCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumNewsCategoryWithAggregatesFilter<$PrismaModel> | $Enums.NewsCategory
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumNewsCategoryFilter<$PrismaModel>
    _max?: NestedEnumNewsCategoryFilter<$PrismaModel>
  }

  export type EnumTrendCategoryFilter<$PrismaModel = never> = {
    equals?: $Enums.TrendCategory | EnumTrendCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.TrendCategory[] | ListEnumTrendCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.TrendCategory[] | ListEnumTrendCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumTrendCategoryFilter<$PrismaModel> | $Enums.TrendCategory
  }

  export type NewsItemListRelationFilter = {
    every?: NewsItemWhereInput
    some?: NewsItemWhereInput
    none?: NewsItemWhereInput
  }

  export type NewsItemOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TrendCountOrderByAggregateInput = {
    id?: SortOrder
    hashtag?: SortOrder
    keyword?: SortOrder
    topic?: SortOrder
    postCount?: SortOrder
    uniqueUsers?: SortOrder
    impressionCount?: SortOrder
    engagementCount?: SortOrder
    trendScore?: SortOrder
    velocity?: SortOrder
    peakTime?: SortOrder
    category?: SortOrder
    region?: SortOrder
    language?: SortOrder
    isPromoted?: SortOrder
    isHidden?: SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrder
    lastUpdated?: SortOrder
    createdAt?: SortOrder
  }

  export type TrendAvgOrderByAggregateInput = {
    postCount?: SortOrder
    uniqueUsers?: SortOrder
    impressionCount?: SortOrder
    engagementCount?: SortOrder
    trendScore?: SortOrder
    velocity?: SortOrder
  }

  export type TrendMaxOrderByAggregateInput = {
    id?: SortOrder
    hashtag?: SortOrder
    keyword?: SortOrder
    topic?: SortOrder
    postCount?: SortOrder
    uniqueUsers?: SortOrder
    impressionCount?: SortOrder
    engagementCount?: SortOrder
    trendScore?: SortOrder
    velocity?: SortOrder
    peakTime?: SortOrder
    category?: SortOrder
    region?: SortOrder
    language?: SortOrder
    isPromoted?: SortOrder
    isHidden?: SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrder
    lastUpdated?: SortOrder
    createdAt?: SortOrder
  }

  export type TrendMinOrderByAggregateInput = {
    id?: SortOrder
    hashtag?: SortOrder
    keyword?: SortOrder
    topic?: SortOrder
    postCount?: SortOrder
    uniqueUsers?: SortOrder
    impressionCount?: SortOrder
    engagementCount?: SortOrder
    trendScore?: SortOrder
    velocity?: SortOrder
    peakTime?: SortOrder
    category?: SortOrder
    region?: SortOrder
    language?: SortOrder
    isPromoted?: SortOrder
    isHidden?: SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrder
    lastUpdated?: SortOrder
    createdAt?: SortOrder
  }

  export type TrendSumOrderByAggregateInput = {
    postCount?: SortOrder
    uniqueUsers?: SortOrder
    impressionCount?: SortOrder
    engagementCount?: SortOrder
    trendScore?: SortOrder
    velocity?: SortOrder
  }

  export type EnumTrendCategoryWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TrendCategory | EnumTrendCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.TrendCategory[] | ListEnumTrendCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.TrendCategory[] | ListEnumTrendCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumTrendCategoryWithAggregatesFilter<$PrismaModel> | $Enums.TrendCategory
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTrendCategoryFilter<$PrismaModel>
    _max?: NestedEnumTrendCategoryFilter<$PrismaModel>
  }

  export type UserProfileCreateNestedOneWithoutUserInput = {
    create?: XOR<UserProfileCreateWithoutUserInput, UserProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserProfileCreateOrConnectWithoutUserInput
    connect?: UserProfileWhereUniqueInput
  }

  export type PoliticalAlignmentCreateNestedOneWithoutUserInput = {
    create?: XOR<PoliticalAlignmentCreateWithoutUserInput, PoliticalAlignmentUncheckedCreateWithoutUserInput>
    connectOrCreate?: PoliticalAlignmentCreateOrConnectWithoutUserInput
    connect?: PoliticalAlignmentWhereUniqueInput
  }

  export type InfluenceMetricsCreateNestedOneWithoutUserInput = {
    create?: XOR<InfluenceMetricsCreateWithoutUserInput, InfluenceMetricsUncheckedCreateWithoutUserInput>
    connectOrCreate?: InfluenceMetricsCreateOrConnectWithoutUserInput
    connect?: InfluenceMetricsWhereUniqueInput
  }

  export type SettingsCreateNestedOneWithoutUserInput = {
    create?: XOR<SettingsCreateWithoutUserInput, SettingsUncheckedCreateWithoutUserInput>
    connectOrCreate?: SettingsCreateOrConnectWithoutUserInput
    connect?: SettingsWhereUniqueInput
  }

  export type PostCreateNestedManyWithoutAuthorInput = {
    create?: XOR<PostCreateWithoutAuthorInput, PostUncheckedCreateWithoutAuthorInput> | PostCreateWithoutAuthorInput[] | PostUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: PostCreateOrConnectWithoutAuthorInput | PostCreateOrConnectWithoutAuthorInput[]
    createMany?: PostCreateManyAuthorInputEnvelope
    connect?: PostWhereUniqueInput | PostWhereUniqueInput[]
  }

  export type ReactionCreateNestedManyWithoutUserInput = {
    create?: XOR<ReactionCreateWithoutUserInput, ReactionUncheckedCreateWithoutUserInput> | ReactionCreateWithoutUserInput[] | ReactionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ReactionCreateOrConnectWithoutUserInput | ReactionCreateOrConnectWithoutUserInput[]
    createMany?: ReactionCreateManyUserInputEnvelope
    connect?: ReactionWhereUniqueInput | ReactionWhereUniqueInput[]
  }

  export type UserProfileUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<UserProfileCreateWithoutUserInput, UserProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserProfileCreateOrConnectWithoutUserInput
    connect?: UserProfileWhereUniqueInput
  }

  export type PoliticalAlignmentUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<PoliticalAlignmentCreateWithoutUserInput, PoliticalAlignmentUncheckedCreateWithoutUserInput>
    connectOrCreate?: PoliticalAlignmentCreateOrConnectWithoutUserInput
    connect?: PoliticalAlignmentWhereUniqueInput
  }

  export type InfluenceMetricsUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<InfluenceMetricsCreateWithoutUserInput, InfluenceMetricsUncheckedCreateWithoutUserInput>
    connectOrCreate?: InfluenceMetricsCreateOrConnectWithoutUserInput
    connect?: InfluenceMetricsWhereUniqueInput
  }

  export type SettingsUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<SettingsCreateWithoutUserInput, SettingsUncheckedCreateWithoutUserInput>
    connectOrCreate?: SettingsCreateOrConnectWithoutUserInput
    connect?: SettingsWhereUniqueInput
  }

  export type PostUncheckedCreateNestedManyWithoutAuthorInput = {
    create?: XOR<PostCreateWithoutAuthorInput, PostUncheckedCreateWithoutAuthorInput> | PostCreateWithoutAuthorInput[] | PostUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: PostCreateOrConnectWithoutAuthorInput | PostCreateOrConnectWithoutAuthorInput[]
    createMany?: PostCreateManyAuthorInputEnvelope
    connect?: PostWhereUniqueInput | PostWhereUniqueInput[]
  }

  export type ReactionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ReactionCreateWithoutUserInput, ReactionUncheckedCreateWithoutUserInput> | ReactionCreateWithoutUserInput[] | ReactionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ReactionCreateOrConnectWithoutUserInput | ReactionCreateOrConnectWithoutUserInput[]
    createMany?: ReactionCreateManyUserInputEnvelope
    connect?: ReactionWhereUniqueInput | ReactionWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type UserProfileUpdateOneWithoutUserNestedInput = {
    create?: XOR<UserProfileCreateWithoutUserInput, UserProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserProfileCreateOrConnectWithoutUserInput
    upsert?: UserProfileUpsertWithoutUserInput
    disconnect?: UserProfileWhereInput | boolean
    delete?: UserProfileWhereInput | boolean
    connect?: UserProfileWhereUniqueInput
    update?: XOR<XOR<UserProfileUpdateToOneWithWhereWithoutUserInput, UserProfileUpdateWithoutUserInput>, UserProfileUncheckedUpdateWithoutUserInput>
  }

  export type PoliticalAlignmentUpdateOneWithoutUserNestedInput = {
    create?: XOR<PoliticalAlignmentCreateWithoutUserInput, PoliticalAlignmentUncheckedCreateWithoutUserInput>
    connectOrCreate?: PoliticalAlignmentCreateOrConnectWithoutUserInput
    upsert?: PoliticalAlignmentUpsertWithoutUserInput
    disconnect?: PoliticalAlignmentWhereInput | boolean
    delete?: PoliticalAlignmentWhereInput | boolean
    connect?: PoliticalAlignmentWhereUniqueInput
    update?: XOR<XOR<PoliticalAlignmentUpdateToOneWithWhereWithoutUserInput, PoliticalAlignmentUpdateWithoutUserInput>, PoliticalAlignmentUncheckedUpdateWithoutUserInput>
  }

  export type InfluenceMetricsUpdateOneWithoutUserNestedInput = {
    create?: XOR<InfluenceMetricsCreateWithoutUserInput, InfluenceMetricsUncheckedCreateWithoutUserInput>
    connectOrCreate?: InfluenceMetricsCreateOrConnectWithoutUserInput
    upsert?: InfluenceMetricsUpsertWithoutUserInput
    disconnect?: InfluenceMetricsWhereInput | boolean
    delete?: InfluenceMetricsWhereInput | boolean
    connect?: InfluenceMetricsWhereUniqueInput
    update?: XOR<XOR<InfluenceMetricsUpdateToOneWithWhereWithoutUserInput, InfluenceMetricsUpdateWithoutUserInput>, InfluenceMetricsUncheckedUpdateWithoutUserInput>
  }

  export type SettingsUpdateOneWithoutUserNestedInput = {
    create?: XOR<SettingsCreateWithoutUserInput, SettingsUncheckedCreateWithoutUserInput>
    connectOrCreate?: SettingsCreateOrConnectWithoutUserInput
    upsert?: SettingsUpsertWithoutUserInput
    disconnect?: SettingsWhereInput | boolean
    delete?: SettingsWhereInput | boolean
    connect?: SettingsWhereUniqueInput
    update?: XOR<XOR<SettingsUpdateToOneWithWhereWithoutUserInput, SettingsUpdateWithoutUserInput>, SettingsUncheckedUpdateWithoutUserInput>
  }

  export type PostUpdateManyWithoutAuthorNestedInput = {
    create?: XOR<PostCreateWithoutAuthorInput, PostUncheckedCreateWithoutAuthorInput> | PostCreateWithoutAuthorInput[] | PostUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: PostCreateOrConnectWithoutAuthorInput | PostCreateOrConnectWithoutAuthorInput[]
    upsert?: PostUpsertWithWhereUniqueWithoutAuthorInput | PostUpsertWithWhereUniqueWithoutAuthorInput[]
    createMany?: PostCreateManyAuthorInputEnvelope
    set?: PostWhereUniqueInput | PostWhereUniqueInput[]
    disconnect?: PostWhereUniqueInput | PostWhereUniqueInput[]
    delete?: PostWhereUniqueInput | PostWhereUniqueInput[]
    connect?: PostWhereUniqueInput | PostWhereUniqueInput[]
    update?: PostUpdateWithWhereUniqueWithoutAuthorInput | PostUpdateWithWhereUniqueWithoutAuthorInput[]
    updateMany?: PostUpdateManyWithWhereWithoutAuthorInput | PostUpdateManyWithWhereWithoutAuthorInput[]
    deleteMany?: PostScalarWhereInput | PostScalarWhereInput[]
  }

  export type ReactionUpdateManyWithoutUserNestedInput = {
    create?: XOR<ReactionCreateWithoutUserInput, ReactionUncheckedCreateWithoutUserInput> | ReactionCreateWithoutUserInput[] | ReactionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ReactionCreateOrConnectWithoutUserInput | ReactionCreateOrConnectWithoutUserInput[]
    upsert?: ReactionUpsertWithWhereUniqueWithoutUserInput | ReactionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ReactionCreateManyUserInputEnvelope
    set?: ReactionWhereUniqueInput | ReactionWhereUniqueInput[]
    disconnect?: ReactionWhereUniqueInput | ReactionWhereUniqueInput[]
    delete?: ReactionWhereUniqueInput | ReactionWhereUniqueInput[]
    connect?: ReactionWhereUniqueInput | ReactionWhereUniqueInput[]
    update?: ReactionUpdateWithWhereUniqueWithoutUserInput | ReactionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ReactionUpdateManyWithWhereWithoutUserInput | ReactionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ReactionScalarWhereInput | ReactionScalarWhereInput[]
  }

  export type UserProfileUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<UserProfileCreateWithoutUserInput, UserProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserProfileCreateOrConnectWithoutUserInput
    upsert?: UserProfileUpsertWithoutUserInput
    disconnect?: UserProfileWhereInput | boolean
    delete?: UserProfileWhereInput | boolean
    connect?: UserProfileWhereUniqueInput
    update?: XOR<XOR<UserProfileUpdateToOneWithWhereWithoutUserInput, UserProfileUpdateWithoutUserInput>, UserProfileUncheckedUpdateWithoutUserInput>
  }

  export type PoliticalAlignmentUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<PoliticalAlignmentCreateWithoutUserInput, PoliticalAlignmentUncheckedCreateWithoutUserInput>
    connectOrCreate?: PoliticalAlignmentCreateOrConnectWithoutUserInput
    upsert?: PoliticalAlignmentUpsertWithoutUserInput
    disconnect?: PoliticalAlignmentWhereInput | boolean
    delete?: PoliticalAlignmentWhereInput | boolean
    connect?: PoliticalAlignmentWhereUniqueInput
    update?: XOR<XOR<PoliticalAlignmentUpdateToOneWithWhereWithoutUserInput, PoliticalAlignmentUpdateWithoutUserInput>, PoliticalAlignmentUncheckedUpdateWithoutUserInput>
  }

  export type InfluenceMetricsUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<InfluenceMetricsCreateWithoutUserInput, InfluenceMetricsUncheckedCreateWithoutUserInput>
    connectOrCreate?: InfluenceMetricsCreateOrConnectWithoutUserInput
    upsert?: InfluenceMetricsUpsertWithoutUserInput
    disconnect?: InfluenceMetricsWhereInput | boolean
    delete?: InfluenceMetricsWhereInput | boolean
    connect?: InfluenceMetricsWhereUniqueInput
    update?: XOR<XOR<InfluenceMetricsUpdateToOneWithWhereWithoutUserInput, InfluenceMetricsUpdateWithoutUserInput>, InfluenceMetricsUncheckedUpdateWithoutUserInput>
  }

  export type SettingsUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<SettingsCreateWithoutUserInput, SettingsUncheckedCreateWithoutUserInput>
    connectOrCreate?: SettingsCreateOrConnectWithoutUserInput
    upsert?: SettingsUpsertWithoutUserInput
    disconnect?: SettingsWhereInput | boolean
    delete?: SettingsWhereInput | boolean
    connect?: SettingsWhereUniqueInput
    update?: XOR<XOR<SettingsUpdateToOneWithWhereWithoutUserInput, SettingsUpdateWithoutUserInput>, SettingsUncheckedUpdateWithoutUserInput>
  }

  export type PostUncheckedUpdateManyWithoutAuthorNestedInput = {
    create?: XOR<PostCreateWithoutAuthorInput, PostUncheckedCreateWithoutAuthorInput> | PostCreateWithoutAuthorInput[] | PostUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: PostCreateOrConnectWithoutAuthorInput | PostCreateOrConnectWithoutAuthorInput[]
    upsert?: PostUpsertWithWhereUniqueWithoutAuthorInput | PostUpsertWithWhereUniqueWithoutAuthorInput[]
    createMany?: PostCreateManyAuthorInputEnvelope
    set?: PostWhereUniqueInput | PostWhereUniqueInput[]
    disconnect?: PostWhereUniqueInput | PostWhereUniqueInput[]
    delete?: PostWhereUniqueInput | PostWhereUniqueInput[]
    connect?: PostWhereUniqueInput | PostWhereUniqueInput[]
    update?: PostUpdateWithWhereUniqueWithoutAuthorInput | PostUpdateWithWhereUniqueWithoutAuthorInput[]
    updateMany?: PostUpdateManyWithWhereWithoutAuthorInput | PostUpdateManyWithWhereWithoutAuthorInput[]
    deleteMany?: PostScalarWhereInput | PostScalarWhereInput[]
  }

  export type ReactionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ReactionCreateWithoutUserInput, ReactionUncheckedCreateWithoutUserInput> | ReactionCreateWithoutUserInput[] | ReactionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ReactionCreateOrConnectWithoutUserInput | ReactionCreateOrConnectWithoutUserInput[]
    upsert?: ReactionUpsertWithWhereUniqueWithoutUserInput | ReactionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ReactionCreateManyUserInputEnvelope
    set?: ReactionWhereUniqueInput | ReactionWhereUniqueInput[]
    disconnect?: ReactionWhereUniqueInput | ReactionWhereUniqueInput[]
    delete?: ReactionWhereUniqueInput | ReactionWhereUniqueInput[]
    connect?: ReactionWhereUniqueInput | ReactionWhereUniqueInput[]
    update?: ReactionUpdateWithWhereUniqueWithoutUserInput | ReactionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ReactionUpdateManyWithWhereWithoutUserInput | ReactionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ReactionScalarWhereInput | ReactionScalarWhereInput[]
  }

  export type UserProfileCreatespecialtyAreasInput = {
    set: string[]
  }

  export type UserAccountCreateNestedOneWithoutProfileInput = {
    create?: XOR<UserAccountCreateWithoutProfileInput, UserAccountUncheckedCreateWithoutProfileInput>
    connectOrCreate?: UserAccountCreateOrConnectWithoutProfileInput
    connect?: UserAccountWhereUniqueInput
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type EnumPersonaTypeFieldUpdateOperationsInput = {
    set?: $Enums.PersonaType
  }

  export type UserProfileUpdatespecialtyAreasInput = {
    set?: string[]
    push?: string | string[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserAccountUpdateOneRequiredWithoutProfileNestedInput = {
    create?: XOR<UserAccountCreateWithoutProfileInput, UserAccountUncheckedCreateWithoutProfileInput>
    connectOrCreate?: UserAccountCreateOrConnectWithoutProfileInput
    upsert?: UserAccountUpsertWithoutProfileInput
    connect?: UserAccountWhereUniqueInput
    update?: XOR<XOR<UserAccountUpdateToOneWithWhereWithoutProfileInput, UserAccountUpdateWithoutProfileInput>, UserAccountUncheckedUpdateWithoutProfileInput>
  }

  export type PoliticalAlignmentCreateprimaryIssuesInput = {
    set: string[]
  }

  export type PoliticalAlignmentCreateideologyTagsInput = {
    set: string[]
  }

  export type UserAccountCreateNestedOneWithoutPoliticalAlignmentInput = {
    create?: XOR<UserAccountCreateWithoutPoliticalAlignmentInput, UserAccountUncheckedCreateWithoutPoliticalAlignmentInput>
    connectOrCreate?: UserAccountCreateOrConnectWithoutPoliticalAlignmentInput
    connect?: UserAccountWhereUniqueInput
  }

  export type PersonaCreateNestedManyWithoutPoliticalAlignmentInput = {
    create?: XOR<PersonaCreateWithoutPoliticalAlignmentInput, PersonaUncheckedCreateWithoutPoliticalAlignmentInput> | PersonaCreateWithoutPoliticalAlignmentInput[] | PersonaUncheckedCreateWithoutPoliticalAlignmentInput[]
    connectOrCreate?: PersonaCreateOrConnectWithoutPoliticalAlignmentInput | PersonaCreateOrConnectWithoutPoliticalAlignmentInput[]
    createMany?: PersonaCreateManyPoliticalAlignmentInputEnvelope
    connect?: PersonaWhereUniqueInput | PersonaWhereUniqueInput[]
  }

  export type PersonaUncheckedCreateNestedManyWithoutPoliticalAlignmentInput = {
    create?: XOR<PersonaCreateWithoutPoliticalAlignmentInput, PersonaUncheckedCreateWithoutPoliticalAlignmentInput> | PersonaCreateWithoutPoliticalAlignmentInput[] | PersonaUncheckedCreateWithoutPoliticalAlignmentInput[]
    connectOrCreate?: PersonaCreateOrConnectWithoutPoliticalAlignmentInput | PersonaCreateOrConnectWithoutPoliticalAlignmentInput[]
    createMany?: PersonaCreateManyPoliticalAlignmentInputEnvelope
    connect?: PersonaWhereUniqueInput | PersonaWhereUniqueInput[]
  }

  export type PoliticalAlignmentUpdateprimaryIssuesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type PoliticalAlignmentUpdateideologyTagsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type UserAccountUpdateOneRequiredWithoutPoliticalAlignmentNestedInput = {
    create?: XOR<UserAccountCreateWithoutPoliticalAlignmentInput, UserAccountUncheckedCreateWithoutPoliticalAlignmentInput>
    connectOrCreate?: UserAccountCreateOrConnectWithoutPoliticalAlignmentInput
    upsert?: UserAccountUpsertWithoutPoliticalAlignmentInput
    connect?: UserAccountWhereUniqueInput
    update?: XOR<XOR<UserAccountUpdateToOneWithWhereWithoutPoliticalAlignmentInput, UserAccountUpdateWithoutPoliticalAlignmentInput>, UserAccountUncheckedUpdateWithoutPoliticalAlignmentInput>
  }

  export type PersonaUpdateManyWithoutPoliticalAlignmentNestedInput = {
    create?: XOR<PersonaCreateWithoutPoliticalAlignmentInput, PersonaUncheckedCreateWithoutPoliticalAlignmentInput> | PersonaCreateWithoutPoliticalAlignmentInput[] | PersonaUncheckedCreateWithoutPoliticalAlignmentInput[]
    connectOrCreate?: PersonaCreateOrConnectWithoutPoliticalAlignmentInput | PersonaCreateOrConnectWithoutPoliticalAlignmentInput[]
    upsert?: PersonaUpsertWithWhereUniqueWithoutPoliticalAlignmentInput | PersonaUpsertWithWhereUniqueWithoutPoliticalAlignmentInput[]
    createMany?: PersonaCreateManyPoliticalAlignmentInputEnvelope
    set?: PersonaWhereUniqueInput | PersonaWhereUniqueInput[]
    disconnect?: PersonaWhereUniqueInput | PersonaWhereUniqueInput[]
    delete?: PersonaWhereUniqueInput | PersonaWhereUniqueInput[]
    connect?: PersonaWhereUniqueInput | PersonaWhereUniqueInput[]
    update?: PersonaUpdateWithWhereUniqueWithoutPoliticalAlignmentInput | PersonaUpdateWithWhereUniqueWithoutPoliticalAlignmentInput[]
    updateMany?: PersonaUpdateManyWithWhereWithoutPoliticalAlignmentInput | PersonaUpdateManyWithWhereWithoutPoliticalAlignmentInput[]
    deleteMany?: PersonaScalarWhereInput | PersonaScalarWhereInput[]
  }

  export type PersonaUncheckedUpdateManyWithoutPoliticalAlignmentNestedInput = {
    create?: XOR<PersonaCreateWithoutPoliticalAlignmentInput, PersonaUncheckedCreateWithoutPoliticalAlignmentInput> | PersonaCreateWithoutPoliticalAlignmentInput[] | PersonaUncheckedCreateWithoutPoliticalAlignmentInput[]
    connectOrCreate?: PersonaCreateOrConnectWithoutPoliticalAlignmentInput | PersonaCreateOrConnectWithoutPoliticalAlignmentInput[]
    upsert?: PersonaUpsertWithWhereUniqueWithoutPoliticalAlignmentInput | PersonaUpsertWithWhereUniqueWithoutPoliticalAlignmentInput[]
    createMany?: PersonaCreateManyPoliticalAlignmentInputEnvelope
    set?: PersonaWhereUniqueInput | PersonaWhereUniqueInput[]
    disconnect?: PersonaWhereUniqueInput | PersonaWhereUniqueInput[]
    delete?: PersonaWhereUniqueInput | PersonaWhereUniqueInput[]
    connect?: PersonaWhereUniqueInput | PersonaWhereUniqueInput[]
    update?: PersonaUpdateWithWhereUniqueWithoutPoliticalAlignmentInput | PersonaUpdateWithWhereUniqueWithoutPoliticalAlignmentInput[]
    updateMany?: PersonaUpdateManyWithWhereWithoutPoliticalAlignmentInput | PersonaUpdateManyWithWhereWithoutPoliticalAlignmentInput[]
    deleteMany?: PersonaScalarWhereInput | PersonaScalarWhereInput[]
  }

  export type UserAccountCreateNestedOneWithoutInfluenceMetricsInput = {
    create?: XOR<UserAccountCreateWithoutInfluenceMetricsInput, UserAccountUncheckedCreateWithoutInfluenceMetricsInput>
    connectOrCreate?: UserAccountCreateOrConnectWithoutInfluenceMetricsInput
    connect?: UserAccountWhereUniqueInput
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserAccountUpdateOneRequiredWithoutInfluenceMetricsNestedInput = {
    create?: XOR<UserAccountCreateWithoutInfluenceMetricsInput, UserAccountUncheckedCreateWithoutInfluenceMetricsInput>
    connectOrCreate?: UserAccountCreateOrConnectWithoutInfluenceMetricsInput
    upsert?: UserAccountUpsertWithoutInfluenceMetricsInput
    connect?: UserAccountWhereUniqueInput
    update?: XOR<XOR<UserAccountUpdateToOneWithWhereWithoutInfluenceMetricsInput, UserAccountUpdateWithoutInfluenceMetricsInput>, UserAccountUncheckedUpdateWithoutInfluenceMetricsInput>
  }

  export type SettingsCreatenewsCategoriesInput = {
    set: $Enums.NewsCategory[]
  }

  export type SettingsCreatenewsLanguagesInput = {
    set: string[]
  }

  export type SettingsCreateaiPersonalitiesInput = {
    set: string[]
  }

  export type SettingsCreatenotificationCategoriesInput = {
    set: $Enums.NotificationCategory[]
  }

  export type UserAccountCreateNestedOneWithoutSettingsInput = {
    create?: XOR<UserAccountCreateWithoutSettingsInput, UserAccountUncheckedCreateWithoutSettingsInput>
    connectOrCreate?: UserAccountCreateOrConnectWithoutSettingsInput
    connect?: UserAccountWhereUniqueInput
  }

  export type SettingsUpdatenewsCategoriesInput = {
    set?: $Enums.NewsCategory[]
    push?: $Enums.NewsCategory | $Enums.NewsCategory[]
  }

  export type SettingsUpdatenewsLanguagesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type SettingsUpdateaiPersonalitiesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type EnumToneStyleFieldUpdateOperationsInput = {
    set?: $Enums.ToneStyle
  }

  export type SettingsUpdatenotificationCategoriesInput = {
    set?: $Enums.NotificationCategory[]
    push?: $Enums.NotificationCategory | $Enums.NotificationCategory[]
  }

  export type EnumProfileVisibilityFieldUpdateOperationsInput = {
    set?: $Enums.ProfileVisibility
  }

  export type EnumThemeFieldUpdateOperationsInput = {
    set?: $Enums.Theme
  }

  export type UserAccountUpdateOneRequiredWithoutSettingsNestedInput = {
    create?: XOR<UserAccountCreateWithoutSettingsInput, UserAccountUncheckedCreateWithoutSettingsInput>
    connectOrCreate?: UserAccountCreateOrConnectWithoutSettingsInput
    upsert?: UserAccountUpsertWithoutSettingsInput
    connect?: UserAccountWhereUniqueInput
    update?: XOR<XOR<UserAccountUpdateToOneWithWhereWithoutSettingsInput, UserAccountUpdateWithoutSettingsInput>, UserAccountUncheckedUpdateWithoutSettingsInput>
  }

  export type PostCreatemediaUrlsInput = {
    set: string[]
  }

  export type PostCreatehashtagsInput = {
    set: string[]
  }

  export type PostCreatementionsInput = {
    set: string[]
  }

  export type UserAccountCreateNestedOneWithoutPostsInput = {
    create?: XOR<UserAccountCreateWithoutPostsInput, UserAccountUncheckedCreateWithoutPostsInput>
    connectOrCreate?: UserAccountCreateOrConnectWithoutPostsInput
    connect?: UserAccountWhereUniqueInput
  }

  export type PersonaCreateNestedOneWithoutPostsInput = {
    create?: XOR<PersonaCreateWithoutPostsInput, PersonaUncheckedCreateWithoutPostsInput>
    connectOrCreate?: PersonaCreateOrConnectWithoutPostsInput
    connect?: PersonaWhereUniqueInput
  }

  export type ThreadCreateNestedOneWithoutPostsInput = {
    create?: XOR<ThreadCreateWithoutPostsInput, ThreadUncheckedCreateWithoutPostsInput>
    connectOrCreate?: ThreadCreateOrConnectWithoutPostsInput
    connect?: ThreadWhereUniqueInput
  }

  export type PostCreateNestedOneWithoutRepliesInput = {
    create?: XOR<PostCreateWithoutRepliesInput, PostUncheckedCreateWithoutRepliesInput>
    connectOrCreate?: PostCreateOrConnectWithoutRepliesInput
    connect?: PostWhereUniqueInput
  }

  export type PostCreateNestedOneWithoutRepostsInput = {
    create?: XOR<PostCreateWithoutRepostsInput, PostUncheckedCreateWithoutRepostsInput>
    connectOrCreate?: PostCreateOrConnectWithoutRepostsInput
    connect?: PostWhereUniqueInput
  }

  export type NewsItemCreateNestedOneWithoutRelatedPostsInput = {
    create?: XOR<NewsItemCreateWithoutRelatedPostsInput, NewsItemUncheckedCreateWithoutRelatedPostsInput>
    connectOrCreate?: NewsItemCreateOrConnectWithoutRelatedPostsInput
    connect?: NewsItemWhereUniqueInput
  }

  export type PostCreateNestedManyWithoutParentPostInput = {
    create?: XOR<PostCreateWithoutParentPostInput, PostUncheckedCreateWithoutParentPostInput> | PostCreateWithoutParentPostInput[] | PostUncheckedCreateWithoutParentPostInput[]
    connectOrCreate?: PostCreateOrConnectWithoutParentPostInput | PostCreateOrConnectWithoutParentPostInput[]
    createMany?: PostCreateManyParentPostInputEnvelope
    connect?: PostWhereUniqueInput | PostWhereUniqueInput[]
  }

  export type PostCreateNestedManyWithoutRepostOfInput = {
    create?: XOR<PostCreateWithoutRepostOfInput, PostUncheckedCreateWithoutRepostOfInput> | PostCreateWithoutRepostOfInput[] | PostUncheckedCreateWithoutRepostOfInput[]
    connectOrCreate?: PostCreateOrConnectWithoutRepostOfInput | PostCreateOrConnectWithoutRepostOfInput[]
    createMany?: PostCreateManyRepostOfInputEnvelope
    connect?: PostWhereUniqueInput | PostWhereUniqueInput[]
  }

  export type ReactionCreateNestedManyWithoutPostInput = {
    create?: XOR<ReactionCreateWithoutPostInput, ReactionUncheckedCreateWithoutPostInput> | ReactionCreateWithoutPostInput[] | ReactionUncheckedCreateWithoutPostInput[]
    connectOrCreate?: ReactionCreateOrConnectWithoutPostInput | ReactionCreateOrConnectWithoutPostInput[]
    createMany?: ReactionCreateManyPostInputEnvelope
    connect?: ReactionWhereUniqueInput | ReactionWhereUniqueInput[]
  }

  export type PostUncheckedCreateNestedManyWithoutParentPostInput = {
    create?: XOR<PostCreateWithoutParentPostInput, PostUncheckedCreateWithoutParentPostInput> | PostCreateWithoutParentPostInput[] | PostUncheckedCreateWithoutParentPostInput[]
    connectOrCreate?: PostCreateOrConnectWithoutParentPostInput | PostCreateOrConnectWithoutParentPostInput[]
    createMany?: PostCreateManyParentPostInputEnvelope
    connect?: PostWhereUniqueInput | PostWhereUniqueInput[]
  }

  export type PostUncheckedCreateNestedManyWithoutRepostOfInput = {
    create?: XOR<PostCreateWithoutRepostOfInput, PostUncheckedCreateWithoutRepostOfInput> | PostCreateWithoutRepostOfInput[] | PostUncheckedCreateWithoutRepostOfInput[]
    connectOrCreate?: PostCreateOrConnectWithoutRepostOfInput | PostCreateOrConnectWithoutRepostOfInput[]
    createMany?: PostCreateManyRepostOfInputEnvelope
    connect?: PostWhereUniqueInput | PostWhereUniqueInput[]
  }

  export type ReactionUncheckedCreateNestedManyWithoutPostInput = {
    create?: XOR<ReactionCreateWithoutPostInput, ReactionUncheckedCreateWithoutPostInput> | ReactionCreateWithoutPostInput[] | ReactionUncheckedCreateWithoutPostInput[]
    connectOrCreate?: ReactionCreateOrConnectWithoutPostInput | ReactionCreateOrConnectWithoutPostInput[]
    createMany?: ReactionCreateManyPostInputEnvelope
    connect?: ReactionWhereUniqueInput | ReactionWhereUniqueInput[]
  }

  export type PostUpdatemediaUrlsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type PostUpdatehashtagsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type PostUpdatementionsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type UserAccountUpdateOneRequiredWithoutPostsNestedInput = {
    create?: XOR<UserAccountCreateWithoutPostsInput, UserAccountUncheckedCreateWithoutPostsInput>
    connectOrCreate?: UserAccountCreateOrConnectWithoutPostsInput
    upsert?: UserAccountUpsertWithoutPostsInput
    connect?: UserAccountWhereUniqueInput
    update?: XOR<XOR<UserAccountUpdateToOneWithWhereWithoutPostsInput, UserAccountUpdateWithoutPostsInput>, UserAccountUncheckedUpdateWithoutPostsInput>
  }

  export type PersonaUpdateOneWithoutPostsNestedInput = {
    create?: XOR<PersonaCreateWithoutPostsInput, PersonaUncheckedCreateWithoutPostsInput>
    connectOrCreate?: PersonaCreateOrConnectWithoutPostsInput
    upsert?: PersonaUpsertWithoutPostsInput
    disconnect?: PersonaWhereInput | boolean
    delete?: PersonaWhereInput | boolean
    connect?: PersonaWhereUniqueInput
    update?: XOR<XOR<PersonaUpdateToOneWithWhereWithoutPostsInput, PersonaUpdateWithoutPostsInput>, PersonaUncheckedUpdateWithoutPostsInput>
  }

  export type ThreadUpdateOneRequiredWithoutPostsNestedInput = {
    create?: XOR<ThreadCreateWithoutPostsInput, ThreadUncheckedCreateWithoutPostsInput>
    connectOrCreate?: ThreadCreateOrConnectWithoutPostsInput
    upsert?: ThreadUpsertWithoutPostsInput
    connect?: ThreadWhereUniqueInput
    update?: XOR<XOR<ThreadUpdateToOneWithWhereWithoutPostsInput, ThreadUpdateWithoutPostsInput>, ThreadUncheckedUpdateWithoutPostsInput>
  }

  export type PostUpdateOneWithoutRepliesNestedInput = {
    create?: XOR<PostCreateWithoutRepliesInput, PostUncheckedCreateWithoutRepliesInput>
    connectOrCreate?: PostCreateOrConnectWithoutRepliesInput
    upsert?: PostUpsertWithoutRepliesInput
    disconnect?: PostWhereInput | boolean
    delete?: PostWhereInput | boolean
    connect?: PostWhereUniqueInput
    update?: XOR<XOR<PostUpdateToOneWithWhereWithoutRepliesInput, PostUpdateWithoutRepliesInput>, PostUncheckedUpdateWithoutRepliesInput>
  }

  export type PostUpdateOneWithoutRepostsNestedInput = {
    create?: XOR<PostCreateWithoutRepostsInput, PostUncheckedCreateWithoutRepostsInput>
    connectOrCreate?: PostCreateOrConnectWithoutRepostsInput
    upsert?: PostUpsertWithoutRepostsInput
    disconnect?: PostWhereInput | boolean
    delete?: PostWhereInput | boolean
    connect?: PostWhereUniqueInput
    update?: XOR<XOR<PostUpdateToOneWithWhereWithoutRepostsInput, PostUpdateWithoutRepostsInput>, PostUncheckedUpdateWithoutRepostsInput>
  }

  export type NewsItemUpdateOneWithoutRelatedPostsNestedInput = {
    create?: XOR<NewsItemCreateWithoutRelatedPostsInput, NewsItemUncheckedCreateWithoutRelatedPostsInput>
    connectOrCreate?: NewsItemCreateOrConnectWithoutRelatedPostsInput
    upsert?: NewsItemUpsertWithoutRelatedPostsInput
    disconnect?: NewsItemWhereInput | boolean
    delete?: NewsItemWhereInput | boolean
    connect?: NewsItemWhereUniqueInput
    update?: XOR<XOR<NewsItemUpdateToOneWithWhereWithoutRelatedPostsInput, NewsItemUpdateWithoutRelatedPostsInput>, NewsItemUncheckedUpdateWithoutRelatedPostsInput>
  }

  export type PostUpdateManyWithoutParentPostNestedInput = {
    create?: XOR<PostCreateWithoutParentPostInput, PostUncheckedCreateWithoutParentPostInput> | PostCreateWithoutParentPostInput[] | PostUncheckedCreateWithoutParentPostInput[]
    connectOrCreate?: PostCreateOrConnectWithoutParentPostInput | PostCreateOrConnectWithoutParentPostInput[]
    upsert?: PostUpsertWithWhereUniqueWithoutParentPostInput | PostUpsertWithWhereUniqueWithoutParentPostInput[]
    createMany?: PostCreateManyParentPostInputEnvelope
    set?: PostWhereUniqueInput | PostWhereUniqueInput[]
    disconnect?: PostWhereUniqueInput | PostWhereUniqueInput[]
    delete?: PostWhereUniqueInput | PostWhereUniqueInput[]
    connect?: PostWhereUniqueInput | PostWhereUniqueInput[]
    update?: PostUpdateWithWhereUniqueWithoutParentPostInput | PostUpdateWithWhereUniqueWithoutParentPostInput[]
    updateMany?: PostUpdateManyWithWhereWithoutParentPostInput | PostUpdateManyWithWhereWithoutParentPostInput[]
    deleteMany?: PostScalarWhereInput | PostScalarWhereInput[]
  }

  export type PostUpdateManyWithoutRepostOfNestedInput = {
    create?: XOR<PostCreateWithoutRepostOfInput, PostUncheckedCreateWithoutRepostOfInput> | PostCreateWithoutRepostOfInput[] | PostUncheckedCreateWithoutRepostOfInput[]
    connectOrCreate?: PostCreateOrConnectWithoutRepostOfInput | PostCreateOrConnectWithoutRepostOfInput[]
    upsert?: PostUpsertWithWhereUniqueWithoutRepostOfInput | PostUpsertWithWhereUniqueWithoutRepostOfInput[]
    createMany?: PostCreateManyRepostOfInputEnvelope
    set?: PostWhereUniqueInput | PostWhereUniqueInput[]
    disconnect?: PostWhereUniqueInput | PostWhereUniqueInput[]
    delete?: PostWhereUniqueInput | PostWhereUniqueInput[]
    connect?: PostWhereUniqueInput | PostWhereUniqueInput[]
    update?: PostUpdateWithWhereUniqueWithoutRepostOfInput | PostUpdateWithWhereUniqueWithoutRepostOfInput[]
    updateMany?: PostUpdateManyWithWhereWithoutRepostOfInput | PostUpdateManyWithWhereWithoutRepostOfInput[]
    deleteMany?: PostScalarWhereInput | PostScalarWhereInput[]
  }

  export type ReactionUpdateManyWithoutPostNestedInput = {
    create?: XOR<ReactionCreateWithoutPostInput, ReactionUncheckedCreateWithoutPostInput> | ReactionCreateWithoutPostInput[] | ReactionUncheckedCreateWithoutPostInput[]
    connectOrCreate?: ReactionCreateOrConnectWithoutPostInput | ReactionCreateOrConnectWithoutPostInput[]
    upsert?: ReactionUpsertWithWhereUniqueWithoutPostInput | ReactionUpsertWithWhereUniqueWithoutPostInput[]
    createMany?: ReactionCreateManyPostInputEnvelope
    set?: ReactionWhereUniqueInput | ReactionWhereUniqueInput[]
    disconnect?: ReactionWhereUniqueInput | ReactionWhereUniqueInput[]
    delete?: ReactionWhereUniqueInput | ReactionWhereUniqueInput[]
    connect?: ReactionWhereUniqueInput | ReactionWhereUniqueInput[]
    update?: ReactionUpdateWithWhereUniqueWithoutPostInput | ReactionUpdateWithWhereUniqueWithoutPostInput[]
    updateMany?: ReactionUpdateManyWithWhereWithoutPostInput | ReactionUpdateManyWithWhereWithoutPostInput[]
    deleteMany?: ReactionScalarWhereInput | ReactionScalarWhereInput[]
  }

  export type PostUncheckedUpdateManyWithoutParentPostNestedInput = {
    create?: XOR<PostCreateWithoutParentPostInput, PostUncheckedCreateWithoutParentPostInput> | PostCreateWithoutParentPostInput[] | PostUncheckedCreateWithoutParentPostInput[]
    connectOrCreate?: PostCreateOrConnectWithoutParentPostInput | PostCreateOrConnectWithoutParentPostInput[]
    upsert?: PostUpsertWithWhereUniqueWithoutParentPostInput | PostUpsertWithWhereUniqueWithoutParentPostInput[]
    createMany?: PostCreateManyParentPostInputEnvelope
    set?: PostWhereUniqueInput | PostWhereUniqueInput[]
    disconnect?: PostWhereUniqueInput | PostWhereUniqueInput[]
    delete?: PostWhereUniqueInput | PostWhereUniqueInput[]
    connect?: PostWhereUniqueInput | PostWhereUniqueInput[]
    update?: PostUpdateWithWhereUniqueWithoutParentPostInput | PostUpdateWithWhereUniqueWithoutParentPostInput[]
    updateMany?: PostUpdateManyWithWhereWithoutParentPostInput | PostUpdateManyWithWhereWithoutParentPostInput[]
    deleteMany?: PostScalarWhereInput | PostScalarWhereInput[]
  }

  export type PostUncheckedUpdateManyWithoutRepostOfNestedInput = {
    create?: XOR<PostCreateWithoutRepostOfInput, PostUncheckedCreateWithoutRepostOfInput> | PostCreateWithoutRepostOfInput[] | PostUncheckedCreateWithoutRepostOfInput[]
    connectOrCreate?: PostCreateOrConnectWithoutRepostOfInput | PostCreateOrConnectWithoutRepostOfInput[]
    upsert?: PostUpsertWithWhereUniqueWithoutRepostOfInput | PostUpsertWithWhereUniqueWithoutRepostOfInput[]
    createMany?: PostCreateManyRepostOfInputEnvelope
    set?: PostWhereUniqueInput | PostWhereUniqueInput[]
    disconnect?: PostWhereUniqueInput | PostWhereUniqueInput[]
    delete?: PostWhereUniqueInput | PostWhereUniqueInput[]
    connect?: PostWhereUniqueInput | PostWhereUniqueInput[]
    update?: PostUpdateWithWhereUniqueWithoutRepostOfInput | PostUpdateWithWhereUniqueWithoutRepostOfInput[]
    updateMany?: PostUpdateManyWithWhereWithoutRepostOfInput | PostUpdateManyWithWhereWithoutRepostOfInput[]
    deleteMany?: PostScalarWhereInput | PostScalarWhereInput[]
  }

  export type ReactionUncheckedUpdateManyWithoutPostNestedInput = {
    create?: XOR<ReactionCreateWithoutPostInput, ReactionUncheckedCreateWithoutPostInput> | ReactionCreateWithoutPostInput[] | ReactionUncheckedCreateWithoutPostInput[]
    connectOrCreate?: ReactionCreateOrConnectWithoutPostInput | ReactionCreateOrConnectWithoutPostInput[]
    upsert?: ReactionUpsertWithWhereUniqueWithoutPostInput | ReactionUpsertWithWhereUniqueWithoutPostInput[]
    createMany?: ReactionCreateManyPostInputEnvelope
    set?: ReactionWhereUniqueInput | ReactionWhereUniqueInput[]
    disconnect?: ReactionWhereUniqueInput | ReactionWhereUniqueInput[]
    delete?: ReactionWhereUniqueInput | ReactionWhereUniqueInput[]
    connect?: ReactionWhereUniqueInput | ReactionWhereUniqueInput[]
    update?: ReactionUpdateWithWhereUniqueWithoutPostInput | ReactionUpdateWithWhereUniqueWithoutPostInput[]
    updateMany?: ReactionUpdateManyWithWhereWithoutPostInput | ReactionUpdateManyWithWhereWithoutPostInput[]
    deleteMany?: ReactionScalarWhereInput | ReactionScalarWhereInput[]
  }

  export type PostCreateNestedManyWithoutThreadInput = {
    create?: XOR<PostCreateWithoutThreadInput, PostUncheckedCreateWithoutThreadInput> | PostCreateWithoutThreadInput[] | PostUncheckedCreateWithoutThreadInput[]
    connectOrCreate?: PostCreateOrConnectWithoutThreadInput | PostCreateOrConnectWithoutThreadInput[]
    createMany?: PostCreateManyThreadInputEnvelope
    connect?: PostWhereUniqueInput | PostWhereUniqueInput[]
  }

  export type PostUncheckedCreateNestedManyWithoutThreadInput = {
    create?: XOR<PostCreateWithoutThreadInput, PostUncheckedCreateWithoutThreadInput> | PostCreateWithoutThreadInput[] | PostUncheckedCreateWithoutThreadInput[]
    connectOrCreate?: PostCreateOrConnectWithoutThreadInput | PostCreateOrConnectWithoutThreadInput[]
    createMany?: PostCreateManyThreadInputEnvelope
    connect?: PostWhereUniqueInput | PostWhereUniqueInput[]
  }

  export type PostUpdateManyWithoutThreadNestedInput = {
    create?: XOR<PostCreateWithoutThreadInput, PostUncheckedCreateWithoutThreadInput> | PostCreateWithoutThreadInput[] | PostUncheckedCreateWithoutThreadInput[]
    connectOrCreate?: PostCreateOrConnectWithoutThreadInput | PostCreateOrConnectWithoutThreadInput[]
    upsert?: PostUpsertWithWhereUniqueWithoutThreadInput | PostUpsertWithWhereUniqueWithoutThreadInput[]
    createMany?: PostCreateManyThreadInputEnvelope
    set?: PostWhereUniqueInput | PostWhereUniqueInput[]
    disconnect?: PostWhereUniqueInput | PostWhereUniqueInput[]
    delete?: PostWhereUniqueInput | PostWhereUniqueInput[]
    connect?: PostWhereUniqueInput | PostWhereUniqueInput[]
    update?: PostUpdateWithWhereUniqueWithoutThreadInput | PostUpdateWithWhereUniqueWithoutThreadInput[]
    updateMany?: PostUpdateManyWithWhereWithoutThreadInput | PostUpdateManyWithWhereWithoutThreadInput[]
    deleteMany?: PostScalarWhereInput | PostScalarWhereInput[]
  }

  export type PostUncheckedUpdateManyWithoutThreadNestedInput = {
    create?: XOR<PostCreateWithoutThreadInput, PostUncheckedCreateWithoutThreadInput> | PostCreateWithoutThreadInput[] | PostUncheckedCreateWithoutThreadInput[]
    connectOrCreate?: PostCreateOrConnectWithoutThreadInput | PostCreateOrConnectWithoutThreadInput[]
    upsert?: PostUpsertWithWhereUniqueWithoutThreadInput | PostUpsertWithWhereUniqueWithoutThreadInput[]
    createMany?: PostCreateManyThreadInputEnvelope
    set?: PostWhereUniqueInput | PostWhereUniqueInput[]
    disconnect?: PostWhereUniqueInput | PostWhereUniqueInput[]
    delete?: PostWhereUniqueInput | PostWhereUniqueInput[]
    connect?: PostWhereUniqueInput | PostWhereUniqueInput[]
    update?: PostUpdateWithWhereUniqueWithoutThreadInput | PostUpdateWithWhereUniqueWithoutThreadInput[]
    updateMany?: PostUpdateManyWithWhereWithoutThreadInput | PostUpdateManyWithWhereWithoutThreadInput[]
    deleteMany?: PostScalarWhereInput | PostScalarWhereInput[]
  }

  export type UserAccountCreateNestedOneWithoutReactionsInput = {
    create?: XOR<UserAccountCreateWithoutReactionsInput, UserAccountUncheckedCreateWithoutReactionsInput>
    connectOrCreate?: UserAccountCreateOrConnectWithoutReactionsInput
    connect?: UserAccountWhereUniqueInput
  }

  export type PostCreateNestedOneWithoutReactionsInput = {
    create?: XOR<PostCreateWithoutReactionsInput, PostUncheckedCreateWithoutReactionsInput>
    connectOrCreate?: PostCreateOrConnectWithoutReactionsInput
    connect?: PostWhereUniqueInput
  }

  export type EnumReactionTypeFieldUpdateOperationsInput = {
    set?: $Enums.ReactionType
  }

  export type UserAccountUpdateOneRequiredWithoutReactionsNestedInput = {
    create?: XOR<UserAccountCreateWithoutReactionsInput, UserAccountUncheckedCreateWithoutReactionsInput>
    connectOrCreate?: UserAccountCreateOrConnectWithoutReactionsInput
    upsert?: UserAccountUpsertWithoutReactionsInput
    connect?: UserAccountWhereUniqueInput
    update?: XOR<XOR<UserAccountUpdateToOneWithWhereWithoutReactionsInput, UserAccountUpdateWithoutReactionsInput>, UserAccountUncheckedUpdateWithoutReactionsInput>
  }

  export type PostUpdateOneRequiredWithoutReactionsNestedInput = {
    create?: XOR<PostCreateWithoutReactionsInput, PostUncheckedCreateWithoutReactionsInput>
    connectOrCreate?: PostCreateOrConnectWithoutReactionsInput
    upsert?: PostUpsertWithoutReactionsInput
    connect?: PostWhereUniqueInput
    update?: XOR<XOR<PostUpdateToOneWithWhereWithoutReactionsInput, PostUpdateWithoutReactionsInput>, PostUncheckedUpdateWithoutReactionsInput>
  }

  export type PersonaCreatepersonalityTraitsInput = {
    set: string[]
  }

  export type PersonaCreateinterestsInput = {
    set: string[]
  }

  export type PersonaCreateexpertiseInput = {
    set: string[]
  }

  export type PoliticalAlignmentCreateNestedOneWithoutPersonasInput = {
    create?: XOR<PoliticalAlignmentCreateWithoutPersonasInput, PoliticalAlignmentUncheckedCreateWithoutPersonasInput>
    connectOrCreate?: PoliticalAlignmentCreateOrConnectWithoutPersonasInput
    connect?: PoliticalAlignmentWhereUniqueInput
  }

  export type PostCreateNestedManyWithoutPersonaInput = {
    create?: XOR<PostCreateWithoutPersonaInput, PostUncheckedCreateWithoutPersonaInput> | PostCreateWithoutPersonaInput[] | PostUncheckedCreateWithoutPersonaInput[]
    connectOrCreate?: PostCreateOrConnectWithoutPersonaInput | PostCreateOrConnectWithoutPersonaInput[]
    createMany?: PostCreateManyPersonaInputEnvelope
    connect?: PostWhereUniqueInput | PostWhereUniqueInput[]
  }

  export type PostUncheckedCreateNestedManyWithoutPersonaInput = {
    create?: XOR<PostCreateWithoutPersonaInput, PostUncheckedCreateWithoutPersonaInput> | PostCreateWithoutPersonaInput[] | PostUncheckedCreateWithoutPersonaInput[]
    connectOrCreate?: PostCreateOrConnectWithoutPersonaInput | PostCreateOrConnectWithoutPersonaInput[]
    createMany?: PostCreateManyPersonaInputEnvelope
    connect?: PostWhereUniqueInput | PostWhereUniqueInput[]
  }

  export type PersonaUpdatepersonalityTraitsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type PersonaUpdateinterestsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type PersonaUpdateexpertiseInput = {
    set?: string[]
    push?: string | string[]
  }

  export type PoliticalAlignmentUpdateOneRequiredWithoutPersonasNestedInput = {
    create?: XOR<PoliticalAlignmentCreateWithoutPersonasInput, PoliticalAlignmentUncheckedCreateWithoutPersonasInput>
    connectOrCreate?: PoliticalAlignmentCreateOrConnectWithoutPersonasInput
    upsert?: PoliticalAlignmentUpsertWithoutPersonasInput
    connect?: PoliticalAlignmentWhereUniqueInput
    update?: XOR<XOR<PoliticalAlignmentUpdateToOneWithWhereWithoutPersonasInput, PoliticalAlignmentUpdateWithoutPersonasInput>, PoliticalAlignmentUncheckedUpdateWithoutPersonasInput>
  }

  export type PostUpdateManyWithoutPersonaNestedInput = {
    create?: XOR<PostCreateWithoutPersonaInput, PostUncheckedCreateWithoutPersonaInput> | PostCreateWithoutPersonaInput[] | PostUncheckedCreateWithoutPersonaInput[]
    connectOrCreate?: PostCreateOrConnectWithoutPersonaInput | PostCreateOrConnectWithoutPersonaInput[]
    upsert?: PostUpsertWithWhereUniqueWithoutPersonaInput | PostUpsertWithWhereUniqueWithoutPersonaInput[]
    createMany?: PostCreateManyPersonaInputEnvelope
    set?: PostWhereUniqueInput | PostWhereUniqueInput[]
    disconnect?: PostWhereUniqueInput | PostWhereUniqueInput[]
    delete?: PostWhereUniqueInput | PostWhereUniqueInput[]
    connect?: PostWhereUniqueInput | PostWhereUniqueInput[]
    update?: PostUpdateWithWhereUniqueWithoutPersonaInput | PostUpdateWithWhereUniqueWithoutPersonaInput[]
    updateMany?: PostUpdateManyWithWhereWithoutPersonaInput | PostUpdateManyWithWhereWithoutPersonaInput[]
    deleteMany?: PostScalarWhereInput | PostScalarWhereInput[]
  }

  export type PostUncheckedUpdateManyWithoutPersonaNestedInput = {
    create?: XOR<PostCreateWithoutPersonaInput, PostUncheckedCreateWithoutPersonaInput> | PostCreateWithoutPersonaInput[] | PostUncheckedCreateWithoutPersonaInput[]
    connectOrCreate?: PostCreateOrConnectWithoutPersonaInput | PostCreateOrConnectWithoutPersonaInput[]
    upsert?: PostUpsertWithWhereUniqueWithoutPersonaInput | PostUpsertWithWhereUniqueWithoutPersonaInput[]
    createMany?: PostCreateManyPersonaInputEnvelope
    set?: PostWhereUniqueInput | PostWhereUniqueInput[]
    disconnect?: PostWhereUniqueInput | PostWhereUniqueInput[]
    delete?: PostWhereUniqueInput | PostWhereUniqueInput[]
    connect?: PostWhereUniqueInput | PostWhereUniqueInput[]
    update?: PostUpdateWithWhereUniqueWithoutPersonaInput | PostUpdateWithWhereUniqueWithoutPersonaInput[]
    updateMany?: PostUpdateManyWithWhereWithoutPersonaInput | PostUpdateManyWithWhereWithoutPersonaInput[]
    deleteMany?: PostScalarWhereInput | PostScalarWhereInput[]
  }

  export type NewsItemCreatetopicsInput = {
    set: string[]
  }

  export type NewsItemCreatekeywordsInput = {
    set: string[]
  }

  export type NewsItemCreateentitiesInput = {
    set: string[]
  }

  export type NewsItemCreatetopicTagsInput = {
    set: string[]
  }

  export type TrendCreateNestedManyWithoutNewsItemsInput = {
    create?: XOR<TrendCreateWithoutNewsItemsInput, TrendUncheckedCreateWithoutNewsItemsInput> | TrendCreateWithoutNewsItemsInput[] | TrendUncheckedCreateWithoutNewsItemsInput[]
    connectOrCreate?: TrendCreateOrConnectWithoutNewsItemsInput | TrendCreateOrConnectWithoutNewsItemsInput[]
    connect?: TrendWhereUniqueInput | TrendWhereUniqueInput[]
  }

  export type PostCreateNestedManyWithoutNewsItemInput = {
    create?: XOR<PostCreateWithoutNewsItemInput, PostUncheckedCreateWithoutNewsItemInput> | PostCreateWithoutNewsItemInput[] | PostUncheckedCreateWithoutNewsItemInput[]
    connectOrCreate?: PostCreateOrConnectWithoutNewsItemInput | PostCreateOrConnectWithoutNewsItemInput[]
    createMany?: PostCreateManyNewsItemInputEnvelope
    connect?: PostWhereUniqueInput | PostWhereUniqueInput[]
  }

  export type TrendUncheckedCreateNestedManyWithoutNewsItemsInput = {
    create?: XOR<TrendCreateWithoutNewsItemsInput, TrendUncheckedCreateWithoutNewsItemsInput> | TrendCreateWithoutNewsItemsInput[] | TrendUncheckedCreateWithoutNewsItemsInput[]
    connectOrCreate?: TrendCreateOrConnectWithoutNewsItemsInput | TrendCreateOrConnectWithoutNewsItemsInput[]
    connect?: TrendWhereUniqueInput | TrendWhereUniqueInput[]
  }

  export type PostUncheckedCreateNestedManyWithoutNewsItemInput = {
    create?: XOR<PostCreateWithoutNewsItemInput, PostUncheckedCreateWithoutNewsItemInput> | PostCreateWithoutNewsItemInput[] | PostUncheckedCreateWithoutNewsItemInput[]
    connectOrCreate?: PostCreateOrConnectWithoutNewsItemInput | PostCreateOrConnectWithoutNewsItemInput[]
    createMany?: PostCreateManyNewsItemInputEnvelope
    connect?: PostWhereUniqueInput | PostWhereUniqueInput[]
  }

  export type EnumNewsCategoryFieldUpdateOperationsInput = {
    set?: $Enums.NewsCategory
  }

  export type NewsItemUpdatetopicsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type NewsItemUpdatekeywordsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type NewsItemUpdateentitiesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type NewsItemUpdatetopicTagsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type TrendUpdateManyWithoutNewsItemsNestedInput = {
    create?: XOR<TrendCreateWithoutNewsItemsInput, TrendUncheckedCreateWithoutNewsItemsInput> | TrendCreateWithoutNewsItemsInput[] | TrendUncheckedCreateWithoutNewsItemsInput[]
    connectOrCreate?: TrendCreateOrConnectWithoutNewsItemsInput | TrendCreateOrConnectWithoutNewsItemsInput[]
    upsert?: TrendUpsertWithWhereUniqueWithoutNewsItemsInput | TrendUpsertWithWhereUniqueWithoutNewsItemsInput[]
    set?: TrendWhereUniqueInput | TrendWhereUniqueInput[]
    disconnect?: TrendWhereUniqueInput | TrendWhereUniqueInput[]
    delete?: TrendWhereUniqueInput | TrendWhereUniqueInput[]
    connect?: TrendWhereUniqueInput | TrendWhereUniqueInput[]
    update?: TrendUpdateWithWhereUniqueWithoutNewsItemsInput | TrendUpdateWithWhereUniqueWithoutNewsItemsInput[]
    updateMany?: TrendUpdateManyWithWhereWithoutNewsItemsInput | TrendUpdateManyWithWhereWithoutNewsItemsInput[]
    deleteMany?: TrendScalarWhereInput | TrendScalarWhereInput[]
  }

  export type PostUpdateManyWithoutNewsItemNestedInput = {
    create?: XOR<PostCreateWithoutNewsItemInput, PostUncheckedCreateWithoutNewsItemInput> | PostCreateWithoutNewsItemInput[] | PostUncheckedCreateWithoutNewsItemInput[]
    connectOrCreate?: PostCreateOrConnectWithoutNewsItemInput | PostCreateOrConnectWithoutNewsItemInput[]
    upsert?: PostUpsertWithWhereUniqueWithoutNewsItemInput | PostUpsertWithWhereUniqueWithoutNewsItemInput[]
    createMany?: PostCreateManyNewsItemInputEnvelope
    set?: PostWhereUniqueInput | PostWhereUniqueInput[]
    disconnect?: PostWhereUniqueInput | PostWhereUniqueInput[]
    delete?: PostWhereUniqueInput | PostWhereUniqueInput[]
    connect?: PostWhereUniqueInput | PostWhereUniqueInput[]
    update?: PostUpdateWithWhereUniqueWithoutNewsItemInput | PostUpdateWithWhereUniqueWithoutNewsItemInput[]
    updateMany?: PostUpdateManyWithWhereWithoutNewsItemInput | PostUpdateManyWithWhereWithoutNewsItemInput[]
    deleteMany?: PostScalarWhereInput | PostScalarWhereInput[]
  }

  export type TrendUncheckedUpdateManyWithoutNewsItemsNestedInput = {
    create?: XOR<TrendCreateWithoutNewsItemsInput, TrendUncheckedCreateWithoutNewsItemsInput> | TrendCreateWithoutNewsItemsInput[] | TrendUncheckedCreateWithoutNewsItemsInput[]
    connectOrCreate?: TrendCreateOrConnectWithoutNewsItemsInput | TrendCreateOrConnectWithoutNewsItemsInput[]
    upsert?: TrendUpsertWithWhereUniqueWithoutNewsItemsInput | TrendUpsertWithWhereUniqueWithoutNewsItemsInput[]
    set?: TrendWhereUniqueInput | TrendWhereUniqueInput[]
    disconnect?: TrendWhereUniqueInput | TrendWhereUniqueInput[]
    delete?: TrendWhereUniqueInput | TrendWhereUniqueInput[]
    connect?: TrendWhereUniqueInput | TrendWhereUniqueInput[]
    update?: TrendUpdateWithWhereUniqueWithoutNewsItemsInput | TrendUpdateWithWhereUniqueWithoutNewsItemsInput[]
    updateMany?: TrendUpdateManyWithWhereWithoutNewsItemsInput | TrendUpdateManyWithWhereWithoutNewsItemsInput[]
    deleteMany?: TrendScalarWhereInput | TrendScalarWhereInput[]
  }

  export type PostUncheckedUpdateManyWithoutNewsItemNestedInput = {
    create?: XOR<PostCreateWithoutNewsItemInput, PostUncheckedCreateWithoutNewsItemInput> | PostCreateWithoutNewsItemInput[] | PostUncheckedCreateWithoutNewsItemInput[]
    connectOrCreate?: PostCreateOrConnectWithoutNewsItemInput | PostCreateOrConnectWithoutNewsItemInput[]
    upsert?: PostUpsertWithWhereUniqueWithoutNewsItemInput | PostUpsertWithWhereUniqueWithoutNewsItemInput[]
    createMany?: PostCreateManyNewsItemInputEnvelope
    set?: PostWhereUniqueInput | PostWhereUniqueInput[]
    disconnect?: PostWhereUniqueInput | PostWhereUniqueInput[]
    delete?: PostWhereUniqueInput | PostWhereUniqueInput[]
    connect?: PostWhereUniqueInput | PostWhereUniqueInput[]
    update?: PostUpdateWithWhereUniqueWithoutNewsItemInput | PostUpdateWithWhereUniqueWithoutNewsItemInput[]
    updateMany?: PostUpdateManyWithWhereWithoutNewsItemInput | PostUpdateManyWithWhereWithoutNewsItemInput[]
    deleteMany?: PostScalarWhereInput | PostScalarWhereInput[]
  }

  export type NewsItemCreateNestedManyWithoutTrendsInput = {
    create?: XOR<NewsItemCreateWithoutTrendsInput, NewsItemUncheckedCreateWithoutTrendsInput> | NewsItemCreateWithoutTrendsInput[] | NewsItemUncheckedCreateWithoutTrendsInput[]
    connectOrCreate?: NewsItemCreateOrConnectWithoutTrendsInput | NewsItemCreateOrConnectWithoutTrendsInput[]
    connect?: NewsItemWhereUniqueInput | NewsItemWhereUniqueInput[]
  }

  export type NewsItemUncheckedCreateNestedManyWithoutTrendsInput = {
    create?: XOR<NewsItemCreateWithoutTrendsInput, NewsItemUncheckedCreateWithoutTrendsInput> | NewsItemCreateWithoutTrendsInput[] | NewsItemUncheckedCreateWithoutTrendsInput[]
    connectOrCreate?: NewsItemCreateOrConnectWithoutTrendsInput | NewsItemCreateOrConnectWithoutTrendsInput[]
    connect?: NewsItemWhereUniqueInput | NewsItemWhereUniqueInput[]
  }

  export type EnumTrendCategoryFieldUpdateOperationsInput = {
    set?: $Enums.TrendCategory
  }

  export type NewsItemUpdateManyWithoutTrendsNestedInput = {
    create?: XOR<NewsItemCreateWithoutTrendsInput, NewsItemUncheckedCreateWithoutTrendsInput> | NewsItemCreateWithoutTrendsInput[] | NewsItemUncheckedCreateWithoutTrendsInput[]
    connectOrCreate?: NewsItemCreateOrConnectWithoutTrendsInput | NewsItemCreateOrConnectWithoutTrendsInput[]
    upsert?: NewsItemUpsertWithWhereUniqueWithoutTrendsInput | NewsItemUpsertWithWhereUniqueWithoutTrendsInput[]
    set?: NewsItemWhereUniqueInput | NewsItemWhereUniqueInput[]
    disconnect?: NewsItemWhereUniqueInput | NewsItemWhereUniqueInput[]
    delete?: NewsItemWhereUniqueInput | NewsItemWhereUniqueInput[]
    connect?: NewsItemWhereUniqueInput | NewsItemWhereUniqueInput[]
    update?: NewsItemUpdateWithWhereUniqueWithoutTrendsInput | NewsItemUpdateWithWhereUniqueWithoutTrendsInput[]
    updateMany?: NewsItemUpdateManyWithWhereWithoutTrendsInput | NewsItemUpdateManyWithWhereWithoutTrendsInput[]
    deleteMany?: NewsItemScalarWhereInput | NewsItemScalarWhereInput[]
  }

  export type NewsItemUncheckedUpdateManyWithoutTrendsNestedInput = {
    create?: XOR<NewsItemCreateWithoutTrendsInput, NewsItemUncheckedCreateWithoutTrendsInput> | NewsItemCreateWithoutTrendsInput[] | NewsItemUncheckedCreateWithoutTrendsInput[]
    connectOrCreate?: NewsItemCreateOrConnectWithoutTrendsInput | NewsItemCreateOrConnectWithoutTrendsInput[]
    upsert?: NewsItemUpsertWithWhereUniqueWithoutTrendsInput | NewsItemUpsertWithWhereUniqueWithoutTrendsInput[]
    set?: NewsItemWhereUniqueInput | NewsItemWhereUniqueInput[]
    disconnect?: NewsItemWhereUniqueInput | NewsItemWhereUniqueInput[]
    delete?: NewsItemWhereUniqueInput | NewsItemWhereUniqueInput[]
    connect?: NewsItemWhereUniqueInput | NewsItemWhereUniqueInput[]
    update?: NewsItemUpdateWithWhereUniqueWithoutTrendsInput | NewsItemUpdateWithWhereUniqueWithoutTrendsInput[]
    updateMany?: NewsItemUpdateManyWithWhereWithoutTrendsInput | NewsItemUpdateManyWithWhereWithoutTrendsInput[]
    deleteMany?: NewsItemScalarWhereInput | NewsItemScalarWhereInput[]
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumPersonaTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.PersonaType | EnumPersonaTypeFieldRefInput<$PrismaModel>
    in?: $Enums.PersonaType[] | ListEnumPersonaTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.PersonaType[] | ListEnumPersonaTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumPersonaTypeFilter<$PrismaModel> | $Enums.PersonaType
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedEnumPersonaTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PersonaType | EnumPersonaTypeFieldRefInput<$PrismaModel>
    in?: $Enums.PersonaType[] | ListEnumPersonaTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.PersonaType[] | ListEnumPersonaTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumPersonaTypeWithAggregatesFilter<$PrismaModel> | $Enums.PersonaType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPersonaTypeFilter<$PrismaModel>
    _max?: NestedEnumPersonaTypeFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedEnumToneStyleFilter<$PrismaModel = never> = {
    equals?: $Enums.ToneStyle | EnumToneStyleFieldRefInput<$PrismaModel>
    in?: $Enums.ToneStyle[] | ListEnumToneStyleFieldRefInput<$PrismaModel>
    notIn?: $Enums.ToneStyle[] | ListEnumToneStyleFieldRefInput<$PrismaModel>
    not?: NestedEnumToneStyleFilter<$PrismaModel> | $Enums.ToneStyle
  }

  export type NestedEnumProfileVisibilityFilter<$PrismaModel = never> = {
    equals?: $Enums.ProfileVisibility | EnumProfileVisibilityFieldRefInput<$PrismaModel>
    in?: $Enums.ProfileVisibility[] | ListEnumProfileVisibilityFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProfileVisibility[] | ListEnumProfileVisibilityFieldRefInput<$PrismaModel>
    not?: NestedEnumProfileVisibilityFilter<$PrismaModel> | $Enums.ProfileVisibility
  }

  export type NestedEnumThemeFilter<$PrismaModel = never> = {
    equals?: $Enums.Theme | EnumThemeFieldRefInput<$PrismaModel>
    in?: $Enums.Theme[] | ListEnumThemeFieldRefInput<$PrismaModel>
    notIn?: $Enums.Theme[] | ListEnumThemeFieldRefInput<$PrismaModel>
    not?: NestedEnumThemeFilter<$PrismaModel> | $Enums.Theme
  }

  export type NestedEnumToneStyleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ToneStyle | EnumToneStyleFieldRefInput<$PrismaModel>
    in?: $Enums.ToneStyle[] | ListEnumToneStyleFieldRefInput<$PrismaModel>
    notIn?: $Enums.ToneStyle[] | ListEnumToneStyleFieldRefInput<$PrismaModel>
    not?: NestedEnumToneStyleWithAggregatesFilter<$PrismaModel> | $Enums.ToneStyle
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumToneStyleFilter<$PrismaModel>
    _max?: NestedEnumToneStyleFilter<$PrismaModel>
  }

  export type NestedEnumProfileVisibilityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ProfileVisibility | EnumProfileVisibilityFieldRefInput<$PrismaModel>
    in?: $Enums.ProfileVisibility[] | ListEnumProfileVisibilityFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProfileVisibility[] | ListEnumProfileVisibilityFieldRefInput<$PrismaModel>
    not?: NestedEnumProfileVisibilityWithAggregatesFilter<$PrismaModel> | $Enums.ProfileVisibility
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumProfileVisibilityFilter<$PrismaModel>
    _max?: NestedEnumProfileVisibilityFilter<$PrismaModel>
  }

  export type NestedEnumThemeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Theme | EnumThemeFieldRefInput<$PrismaModel>
    in?: $Enums.Theme[] | ListEnumThemeFieldRefInput<$PrismaModel>
    notIn?: $Enums.Theme[] | ListEnumThemeFieldRefInput<$PrismaModel>
    not?: NestedEnumThemeWithAggregatesFilter<$PrismaModel> | $Enums.Theme
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumThemeFilter<$PrismaModel>
    _max?: NestedEnumThemeFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedEnumReactionTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.ReactionType | EnumReactionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ReactionType[] | ListEnumReactionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ReactionType[] | ListEnumReactionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumReactionTypeFilter<$PrismaModel> | $Enums.ReactionType
  }

  export type NestedEnumReactionTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ReactionType | EnumReactionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ReactionType[] | ListEnumReactionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ReactionType[] | ListEnumReactionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumReactionTypeWithAggregatesFilter<$PrismaModel> | $Enums.ReactionType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumReactionTypeFilter<$PrismaModel>
    _max?: NestedEnumReactionTypeFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedEnumNewsCategoryFilter<$PrismaModel = never> = {
    equals?: $Enums.NewsCategory | EnumNewsCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.NewsCategory[] | ListEnumNewsCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.NewsCategory[] | ListEnumNewsCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumNewsCategoryFilter<$PrismaModel> | $Enums.NewsCategory
  }

  export type NestedEnumNewsCategoryWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NewsCategory | EnumNewsCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.NewsCategory[] | ListEnumNewsCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.NewsCategory[] | ListEnumNewsCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumNewsCategoryWithAggregatesFilter<$PrismaModel> | $Enums.NewsCategory
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumNewsCategoryFilter<$PrismaModel>
    _max?: NestedEnumNewsCategoryFilter<$PrismaModel>
  }

  export type NestedEnumTrendCategoryFilter<$PrismaModel = never> = {
    equals?: $Enums.TrendCategory | EnumTrendCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.TrendCategory[] | ListEnumTrendCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.TrendCategory[] | ListEnumTrendCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumTrendCategoryFilter<$PrismaModel> | $Enums.TrendCategory
  }

  export type NestedEnumTrendCategoryWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TrendCategory | EnumTrendCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.TrendCategory[] | ListEnumTrendCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.TrendCategory[] | ListEnumTrendCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumTrendCategoryWithAggregatesFilter<$PrismaModel> | $Enums.TrendCategory
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTrendCategoryFilter<$PrismaModel>
    _max?: NestedEnumTrendCategoryFilter<$PrismaModel>
  }

  export type UserProfileCreateWithoutUserInput = {
    id?: string
    displayName: string
    bio?: string | null
    profileImageUrl?: string | null
    headerImageUrl?: string | null
    location?: string | null
    website?: string | null
    personaType: $Enums.PersonaType
    specialtyAreas?: UserProfileCreatespecialtyAreasInput | string[]
    verificationBadge?: boolean
    followerCount?: number
    followingCount?: number
    postCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserProfileUncheckedCreateWithoutUserInput = {
    id?: string
    displayName: string
    bio?: string | null
    profileImageUrl?: string | null
    headerImageUrl?: string | null
    location?: string | null
    website?: string | null
    personaType: $Enums.PersonaType
    specialtyAreas?: UserProfileCreatespecialtyAreasInput | string[]
    verificationBadge?: boolean
    followerCount?: number
    followingCount?: number
    postCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserProfileCreateOrConnectWithoutUserInput = {
    where: UserProfileWhereUniqueInput
    create: XOR<UserProfileCreateWithoutUserInput, UserProfileUncheckedCreateWithoutUserInput>
  }

  export type PoliticalAlignmentCreateWithoutUserInput = {
    id?: string
    economicPosition: number
    socialPosition: number
    primaryIssues?: PoliticalAlignmentCreateprimaryIssuesInput | string[]
    partyAffiliation?: string | null
    ideologyTags?: PoliticalAlignmentCreateideologyTagsInput | string[]
    debateWillingness: number
    controversyTolerance: number
    createdAt?: Date | string
    updatedAt?: Date | string
    personas?: PersonaCreateNestedManyWithoutPoliticalAlignmentInput
  }

  export type PoliticalAlignmentUncheckedCreateWithoutUserInput = {
    id?: string
    economicPosition: number
    socialPosition: number
    primaryIssues?: PoliticalAlignmentCreateprimaryIssuesInput | string[]
    partyAffiliation?: string | null
    ideologyTags?: PoliticalAlignmentCreateideologyTagsInput | string[]
    debateWillingness: number
    controversyTolerance: number
    createdAt?: Date | string
    updatedAt?: Date | string
    personas?: PersonaUncheckedCreateNestedManyWithoutPoliticalAlignmentInput
  }

  export type PoliticalAlignmentCreateOrConnectWithoutUserInput = {
    where: PoliticalAlignmentWhereUniqueInput
    create: XOR<PoliticalAlignmentCreateWithoutUserInput, PoliticalAlignmentUncheckedCreateWithoutUserInput>
  }

  export type InfluenceMetricsCreateWithoutUserInput = {
    id?: string
    followerCount?: number
    followingCount?: number
    engagementRate?: number
    reachScore?: number
    approvalRating?: number
    controversyLevel?: number
    trendingScore?: number
    followerGrowthDaily?: number
    followerGrowthWeekly?: number
    followerGrowthMonthly?: number
    totalLikes?: number
    totalReshares?: number
    totalComments?: number
    influenceRank?: number
    categoryRank?: number
    lastUpdated?: Date | string
    createdAt?: Date | string
  }

  export type InfluenceMetricsUncheckedCreateWithoutUserInput = {
    id?: string
    followerCount?: number
    followingCount?: number
    engagementRate?: number
    reachScore?: number
    approvalRating?: number
    controversyLevel?: number
    trendingScore?: number
    followerGrowthDaily?: number
    followerGrowthWeekly?: number
    followerGrowthMonthly?: number
    totalLikes?: number
    totalReshares?: number
    totalComments?: number
    influenceRank?: number
    categoryRank?: number
    lastUpdated?: Date | string
    createdAt?: Date | string
  }

  export type InfluenceMetricsCreateOrConnectWithoutUserInput = {
    where: InfluenceMetricsWhereUniqueInput
    create: XOR<InfluenceMetricsCreateWithoutUserInput, InfluenceMetricsUncheckedCreateWithoutUserInput>
  }

  export type SettingsCreateWithoutUserInput = {
    id?: string
    newsRegion?: string
    newsCategories?: SettingsCreatenewsCategoriesInput | $Enums.NewsCategory[]
    newsLanguages?: SettingsCreatenewsLanguagesInput | string[]
    aiChatterLevel?: number
    aiPersonalities?: SettingsCreateaiPersonalitiesInput | string[]
    aiResponseTone?: $Enums.ToneStyle
    emailNotifications?: boolean
    pushNotifications?: boolean
    notificationCategories?: SettingsCreatenotificationCategoriesInput | $Enums.NotificationCategory[]
    profileVisibility?: $Enums.ProfileVisibility
    allowPersonaInteractions?: boolean
    allowDataForAI?: boolean
    theme?: $Enums.Theme
    language?: string
    timezone?: string
    customAIApiKey?: string | null
    customAIBaseUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SettingsUncheckedCreateWithoutUserInput = {
    id?: string
    newsRegion?: string
    newsCategories?: SettingsCreatenewsCategoriesInput | $Enums.NewsCategory[]
    newsLanguages?: SettingsCreatenewsLanguagesInput | string[]
    aiChatterLevel?: number
    aiPersonalities?: SettingsCreateaiPersonalitiesInput | string[]
    aiResponseTone?: $Enums.ToneStyle
    emailNotifications?: boolean
    pushNotifications?: boolean
    notificationCategories?: SettingsCreatenotificationCategoriesInput | $Enums.NotificationCategory[]
    profileVisibility?: $Enums.ProfileVisibility
    allowPersonaInteractions?: boolean
    allowDataForAI?: boolean
    theme?: $Enums.Theme
    language?: string
    timezone?: string
    customAIApiKey?: string | null
    customAIBaseUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SettingsCreateOrConnectWithoutUserInput = {
    where: SettingsWhereUniqueInput
    create: XOR<SettingsCreateWithoutUserInput, SettingsUncheckedCreateWithoutUserInput>
  }

  export type PostCreateWithoutAuthorInput = {
    id?: string
    content: string
    mediaUrls?: PostCreatemediaUrlsInput | string[]
    linkPreview?: NullableJsonNullValueInput | InputJsonValue
    isAIGenerated?: boolean
    hashtags?: PostCreatehashtagsInput | string[]
    mentions?: PostCreatementionsInput | string[]
    newsContext?: string | null
    likeCount?: number
    repostCount?: number
    commentCount?: number
    impressionCount?: number
    contentWarning?: string | null
    isHidden?: boolean
    reportCount?: number
    publishedAt?: Date | string
    editedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    persona?: PersonaCreateNestedOneWithoutPostsInput
    thread: ThreadCreateNestedOneWithoutPostsInput
    parentPost?: PostCreateNestedOneWithoutRepliesInput
    repostOf?: PostCreateNestedOneWithoutRepostsInput
    newsItem?: NewsItemCreateNestedOneWithoutRelatedPostsInput
    replies?: PostCreateNestedManyWithoutParentPostInput
    reposts?: PostCreateNestedManyWithoutRepostOfInput
    reactions?: ReactionCreateNestedManyWithoutPostInput
  }

  export type PostUncheckedCreateWithoutAuthorInput = {
    id?: string
    personaId?: string | null
    content: string
    mediaUrls?: PostCreatemediaUrlsInput | string[]
    linkPreview?: NullableJsonNullValueInput | InputJsonValue
    threadId: string
    parentPostId?: string | null
    repostOfId?: string | null
    isAIGenerated?: boolean
    hashtags?: PostCreatehashtagsInput | string[]
    mentions?: PostCreatementionsInput | string[]
    newsItemId?: string | null
    newsContext?: string | null
    likeCount?: number
    repostCount?: number
    commentCount?: number
    impressionCount?: number
    contentWarning?: string | null
    isHidden?: boolean
    reportCount?: number
    publishedAt?: Date | string
    editedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    replies?: PostUncheckedCreateNestedManyWithoutParentPostInput
    reposts?: PostUncheckedCreateNestedManyWithoutRepostOfInput
    reactions?: ReactionUncheckedCreateNestedManyWithoutPostInput
  }

  export type PostCreateOrConnectWithoutAuthorInput = {
    where: PostWhereUniqueInput
    create: XOR<PostCreateWithoutAuthorInput, PostUncheckedCreateWithoutAuthorInput>
  }

  export type PostCreateManyAuthorInputEnvelope = {
    data: PostCreateManyAuthorInput | PostCreateManyAuthorInput[]
    skipDuplicates?: boolean
  }

  export type ReactionCreateWithoutUserInput = {
    id?: string
    type: $Enums.ReactionType
    createdAt?: Date | string
    post: PostCreateNestedOneWithoutReactionsInput
  }

  export type ReactionUncheckedCreateWithoutUserInput = {
    id?: string
    postId: string
    type: $Enums.ReactionType
    createdAt?: Date | string
  }

  export type ReactionCreateOrConnectWithoutUserInput = {
    where: ReactionWhereUniqueInput
    create: XOR<ReactionCreateWithoutUserInput, ReactionUncheckedCreateWithoutUserInput>
  }

  export type ReactionCreateManyUserInputEnvelope = {
    data: ReactionCreateManyUserInput | ReactionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type UserProfileUpsertWithoutUserInput = {
    update: XOR<UserProfileUpdateWithoutUserInput, UserProfileUncheckedUpdateWithoutUserInput>
    create: XOR<UserProfileCreateWithoutUserInput, UserProfileUncheckedCreateWithoutUserInput>
    where?: UserProfileWhereInput
  }

  export type UserProfileUpdateToOneWithWhereWithoutUserInput = {
    where?: UserProfileWhereInput
    data: XOR<UserProfileUpdateWithoutUserInput, UserProfileUncheckedUpdateWithoutUserInput>
  }

  export type UserProfileUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    profileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    headerImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    personaType?: EnumPersonaTypeFieldUpdateOperationsInput | $Enums.PersonaType
    specialtyAreas?: UserProfileUpdatespecialtyAreasInput | string[]
    verificationBadge?: BoolFieldUpdateOperationsInput | boolean
    followerCount?: IntFieldUpdateOperationsInput | number
    followingCount?: IntFieldUpdateOperationsInput | number
    postCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserProfileUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    profileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    headerImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    personaType?: EnumPersonaTypeFieldUpdateOperationsInput | $Enums.PersonaType
    specialtyAreas?: UserProfileUpdatespecialtyAreasInput | string[]
    verificationBadge?: BoolFieldUpdateOperationsInput | boolean
    followerCount?: IntFieldUpdateOperationsInput | number
    followingCount?: IntFieldUpdateOperationsInput | number
    postCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PoliticalAlignmentUpsertWithoutUserInput = {
    update: XOR<PoliticalAlignmentUpdateWithoutUserInput, PoliticalAlignmentUncheckedUpdateWithoutUserInput>
    create: XOR<PoliticalAlignmentCreateWithoutUserInput, PoliticalAlignmentUncheckedCreateWithoutUserInput>
    where?: PoliticalAlignmentWhereInput
  }

  export type PoliticalAlignmentUpdateToOneWithWhereWithoutUserInput = {
    where?: PoliticalAlignmentWhereInput
    data: XOR<PoliticalAlignmentUpdateWithoutUserInput, PoliticalAlignmentUncheckedUpdateWithoutUserInput>
  }

  export type PoliticalAlignmentUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    economicPosition?: IntFieldUpdateOperationsInput | number
    socialPosition?: IntFieldUpdateOperationsInput | number
    primaryIssues?: PoliticalAlignmentUpdateprimaryIssuesInput | string[]
    partyAffiliation?: NullableStringFieldUpdateOperationsInput | string | null
    ideologyTags?: PoliticalAlignmentUpdateideologyTagsInput | string[]
    debateWillingness?: IntFieldUpdateOperationsInput | number
    controversyTolerance?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    personas?: PersonaUpdateManyWithoutPoliticalAlignmentNestedInput
  }

  export type PoliticalAlignmentUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    economicPosition?: IntFieldUpdateOperationsInput | number
    socialPosition?: IntFieldUpdateOperationsInput | number
    primaryIssues?: PoliticalAlignmentUpdateprimaryIssuesInput | string[]
    partyAffiliation?: NullableStringFieldUpdateOperationsInput | string | null
    ideologyTags?: PoliticalAlignmentUpdateideologyTagsInput | string[]
    debateWillingness?: IntFieldUpdateOperationsInput | number
    controversyTolerance?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    personas?: PersonaUncheckedUpdateManyWithoutPoliticalAlignmentNestedInput
  }

  export type InfluenceMetricsUpsertWithoutUserInput = {
    update: XOR<InfluenceMetricsUpdateWithoutUserInput, InfluenceMetricsUncheckedUpdateWithoutUserInput>
    create: XOR<InfluenceMetricsCreateWithoutUserInput, InfluenceMetricsUncheckedCreateWithoutUserInput>
    where?: InfluenceMetricsWhereInput
  }

  export type InfluenceMetricsUpdateToOneWithWhereWithoutUserInput = {
    where?: InfluenceMetricsWhereInput
    data: XOR<InfluenceMetricsUpdateWithoutUserInput, InfluenceMetricsUncheckedUpdateWithoutUserInput>
  }

  export type InfluenceMetricsUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    followerCount?: IntFieldUpdateOperationsInput | number
    followingCount?: IntFieldUpdateOperationsInput | number
    engagementRate?: FloatFieldUpdateOperationsInput | number
    reachScore?: IntFieldUpdateOperationsInput | number
    approvalRating?: IntFieldUpdateOperationsInput | number
    controversyLevel?: IntFieldUpdateOperationsInput | number
    trendingScore?: IntFieldUpdateOperationsInput | number
    followerGrowthDaily?: IntFieldUpdateOperationsInput | number
    followerGrowthWeekly?: IntFieldUpdateOperationsInput | number
    followerGrowthMonthly?: IntFieldUpdateOperationsInput | number
    totalLikes?: IntFieldUpdateOperationsInput | number
    totalReshares?: IntFieldUpdateOperationsInput | number
    totalComments?: IntFieldUpdateOperationsInput | number
    influenceRank?: IntFieldUpdateOperationsInput | number
    categoryRank?: IntFieldUpdateOperationsInput | number
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InfluenceMetricsUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    followerCount?: IntFieldUpdateOperationsInput | number
    followingCount?: IntFieldUpdateOperationsInput | number
    engagementRate?: FloatFieldUpdateOperationsInput | number
    reachScore?: IntFieldUpdateOperationsInput | number
    approvalRating?: IntFieldUpdateOperationsInput | number
    controversyLevel?: IntFieldUpdateOperationsInput | number
    trendingScore?: IntFieldUpdateOperationsInput | number
    followerGrowthDaily?: IntFieldUpdateOperationsInput | number
    followerGrowthWeekly?: IntFieldUpdateOperationsInput | number
    followerGrowthMonthly?: IntFieldUpdateOperationsInput | number
    totalLikes?: IntFieldUpdateOperationsInput | number
    totalReshares?: IntFieldUpdateOperationsInput | number
    totalComments?: IntFieldUpdateOperationsInput | number
    influenceRank?: IntFieldUpdateOperationsInput | number
    categoryRank?: IntFieldUpdateOperationsInput | number
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SettingsUpsertWithoutUserInput = {
    update: XOR<SettingsUpdateWithoutUserInput, SettingsUncheckedUpdateWithoutUserInput>
    create: XOR<SettingsCreateWithoutUserInput, SettingsUncheckedCreateWithoutUserInput>
    where?: SettingsWhereInput
  }

  export type SettingsUpdateToOneWithWhereWithoutUserInput = {
    where?: SettingsWhereInput
    data: XOR<SettingsUpdateWithoutUserInput, SettingsUncheckedUpdateWithoutUserInput>
  }

  export type SettingsUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    newsRegion?: StringFieldUpdateOperationsInput | string
    newsCategories?: SettingsUpdatenewsCategoriesInput | $Enums.NewsCategory[]
    newsLanguages?: SettingsUpdatenewsLanguagesInput | string[]
    aiChatterLevel?: IntFieldUpdateOperationsInput | number
    aiPersonalities?: SettingsUpdateaiPersonalitiesInput | string[]
    aiResponseTone?: EnumToneStyleFieldUpdateOperationsInput | $Enums.ToneStyle
    emailNotifications?: BoolFieldUpdateOperationsInput | boolean
    pushNotifications?: BoolFieldUpdateOperationsInput | boolean
    notificationCategories?: SettingsUpdatenotificationCategoriesInput | $Enums.NotificationCategory[]
    profileVisibility?: EnumProfileVisibilityFieldUpdateOperationsInput | $Enums.ProfileVisibility
    allowPersonaInteractions?: BoolFieldUpdateOperationsInput | boolean
    allowDataForAI?: BoolFieldUpdateOperationsInput | boolean
    theme?: EnumThemeFieldUpdateOperationsInput | $Enums.Theme
    language?: StringFieldUpdateOperationsInput | string
    timezone?: StringFieldUpdateOperationsInput | string
    customAIApiKey?: NullableStringFieldUpdateOperationsInput | string | null
    customAIBaseUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SettingsUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    newsRegion?: StringFieldUpdateOperationsInput | string
    newsCategories?: SettingsUpdatenewsCategoriesInput | $Enums.NewsCategory[]
    newsLanguages?: SettingsUpdatenewsLanguagesInput | string[]
    aiChatterLevel?: IntFieldUpdateOperationsInput | number
    aiPersonalities?: SettingsUpdateaiPersonalitiesInput | string[]
    aiResponseTone?: EnumToneStyleFieldUpdateOperationsInput | $Enums.ToneStyle
    emailNotifications?: BoolFieldUpdateOperationsInput | boolean
    pushNotifications?: BoolFieldUpdateOperationsInput | boolean
    notificationCategories?: SettingsUpdatenotificationCategoriesInput | $Enums.NotificationCategory[]
    profileVisibility?: EnumProfileVisibilityFieldUpdateOperationsInput | $Enums.ProfileVisibility
    allowPersonaInteractions?: BoolFieldUpdateOperationsInput | boolean
    allowDataForAI?: BoolFieldUpdateOperationsInput | boolean
    theme?: EnumThemeFieldUpdateOperationsInput | $Enums.Theme
    language?: StringFieldUpdateOperationsInput | string
    timezone?: StringFieldUpdateOperationsInput | string
    customAIApiKey?: NullableStringFieldUpdateOperationsInput | string | null
    customAIBaseUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PostUpsertWithWhereUniqueWithoutAuthorInput = {
    where: PostWhereUniqueInput
    update: XOR<PostUpdateWithoutAuthorInput, PostUncheckedUpdateWithoutAuthorInput>
    create: XOR<PostCreateWithoutAuthorInput, PostUncheckedCreateWithoutAuthorInput>
  }

  export type PostUpdateWithWhereUniqueWithoutAuthorInput = {
    where: PostWhereUniqueInput
    data: XOR<PostUpdateWithoutAuthorInput, PostUncheckedUpdateWithoutAuthorInput>
  }

  export type PostUpdateManyWithWhereWithoutAuthorInput = {
    where: PostScalarWhereInput
    data: XOR<PostUpdateManyMutationInput, PostUncheckedUpdateManyWithoutAuthorInput>
  }

  export type PostScalarWhereInput = {
    AND?: PostScalarWhereInput | PostScalarWhereInput[]
    OR?: PostScalarWhereInput[]
    NOT?: PostScalarWhereInput | PostScalarWhereInput[]
    id?: StringFilter<"Post"> | string
    authorId?: StringFilter<"Post"> | string
    personaId?: StringNullableFilter<"Post"> | string | null
    content?: StringFilter<"Post"> | string
    mediaUrls?: StringNullableListFilter<"Post">
    linkPreview?: JsonNullableFilter<"Post">
    threadId?: StringFilter<"Post"> | string
    parentPostId?: StringNullableFilter<"Post"> | string | null
    repostOfId?: StringNullableFilter<"Post"> | string | null
    isAIGenerated?: BoolFilter<"Post"> | boolean
    hashtags?: StringNullableListFilter<"Post">
    mentions?: StringNullableListFilter<"Post">
    newsItemId?: StringNullableFilter<"Post"> | string | null
    newsContext?: StringNullableFilter<"Post"> | string | null
    likeCount?: IntFilter<"Post"> | number
    repostCount?: IntFilter<"Post"> | number
    commentCount?: IntFilter<"Post"> | number
    impressionCount?: IntFilter<"Post"> | number
    contentWarning?: StringNullableFilter<"Post"> | string | null
    isHidden?: BoolFilter<"Post"> | boolean
    reportCount?: IntFilter<"Post"> | number
    publishedAt?: DateTimeFilter<"Post"> | Date | string
    editedAt?: DateTimeNullableFilter<"Post"> | Date | string | null
    createdAt?: DateTimeFilter<"Post"> | Date | string
    updatedAt?: DateTimeFilter<"Post"> | Date | string
  }

  export type ReactionUpsertWithWhereUniqueWithoutUserInput = {
    where: ReactionWhereUniqueInput
    update: XOR<ReactionUpdateWithoutUserInput, ReactionUncheckedUpdateWithoutUserInput>
    create: XOR<ReactionCreateWithoutUserInput, ReactionUncheckedCreateWithoutUserInput>
  }

  export type ReactionUpdateWithWhereUniqueWithoutUserInput = {
    where: ReactionWhereUniqueInput
    data: XOR<ReactionUpdateWithoutUserInput, ReactionUncheckedUpdateWithoutUserInput>
  }

  export type ReactionUpdateManyWithWhereWithoutUserInput = {
    where: ReactionScalarWhereInput
    data: XOR<ReactionUpdateManyMutationInput, ReactionUncheckedUpdateManyWithoutUserInput>
  }

  export type ReactionScalarWhereInput = {
    AND?: ReactionScalarWhereInput | ReactionScalarWhereInput[]
    OR?: ReactionScalarWhereInput[]
    NOT?: ReactionScalarWhereInput | ReactionScalarWhereInput[]
    id?: StringFilter<"Reaction"> | string
    userId?: StringFilter<"Reaction"> | string
    postId?: StringFilter<"Reaction"> | string
    type?: EnumReactionTypeFilter<"Reaction"> | $Enums.ReactionType
    createdAt?: DateTimeFilter<"Reaction"> | Date | string
  }

  export type UserAccountCreateWithoutProfileInput = {
    id?: string
    username: string
    email: string
    passwordHash: string
    emailVerified?: boolean
    isActive?: boolean
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    politicalAlignment?: PoliticalAlignmentCreateNestedOneWithoutUserInput
    influenceMetrics?: InfluenceMetricsCreateNestedOneWithoutUserInput
    settings?: SettingsCreateNestedOneWithoutUserInput
    posts?: PostCreateNestedManyWithoutAuthorInput
    reactions?: ReactionCreateNestedManyWithoutUserInput
  }

  export type UserAccountUncheckedCreateWithoutProfileInput = {
    id?: string
    username: string
    email: string
    passwordHash: string
    emailVerified?: boolean
    isActive?: boolean
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    politicalAlignment?: PoliticalAlignmentUncheckedCreateNestedOneWithoutUserInput
    influenceMetrics?: InfluenceMetricsUncheckedCreateNestedOneWithoutUserInput
    settings?: SettingsUncheckedCreateNestedOneWithoutUserInput
    posts?: PostUncheckedCreateNestedManyWithoutAuthorInput
    reactions?: ReactionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserAccountCreateOrConnectWithoutProfileInput = {
    where: UserAccountWhereUniqueInput
    create: XOR<UserAccountCreateWithoutProfileInput, UserAccountUncheckedCreateWithoutProfileInput>
  }

  export type UserAccountUpsertWithoutProfileInput = {
    update: XOR<UserAccountUpdateWithoutProfileInput, UserAccountUncheckedUpdateWithoutProfileInput>
    create: XOR<UserAccountCreateWithoutProfileInput, UserAccountUncheckedCreateWithoutProfileInput>
    where?: UserAccountWhereInput
  }

  export type UserAccountUpdateToOneWithWhereWithoutProfileInput = {
    where?: UserAccountWhereInput
    data: XOR<UserAccountUpdateWithoutProfileInput, UserAccountUncheckedUpdateWithoutProfileInput>
  }

  export type UserAccountUpdateWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    politicalAlignment?: PoliticalAlignmentUpdateOneWithoutUserNestedInput
    influenceMetrics?: InfluenceMetricsUpdateOneWithoutUserNestedInput
    settings?: SettingsUpdateOneWithoutUserNestedInput
    posts?: PostUpdateManyWithoutAuthorNestedInput
    reactions?: ReactionUpdateManyWithoutUserNestedInput
  }

  export type UserAccountUncheckedUpdateWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    politicalAlignment?: PoliticalAlignmentUncheckedUpdateOneWithoutUserNestedInput
    influenceMetrics?: InfluenceMetricsUncheckedUpdateOneWithoutUserNestedInput
    settings?: SettingsUncheckedUpdateOneWithoutUserNestedInput
    posts?: PostUncheckedUpdateManyWithoutAuthorNestedInput
    reactions?: ReactionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserAccountCreateWithoutPoliticalAlignmentInput = {
    id?: string
    username: string
    email: string
    passwordHash: string
    emailVerified?: boolean
    isActive?: boolean
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    profile?: UserProfileCreateNestedOneWithoutUserInput
    influenceMetrics?: InfluenceMetricsCreateNestedOneWithoutUserInput
    settings?: SettingsCreateNestedOneWithoutUserInput
    posts?: PostCreateNestedManyWithoutAuthorInput
    reactions?: ReactionCreateNestedManyWithoutUserInput
  }

  export type UserAccountUncheckedCreateWithoutPoliticalAlignmentInput = {
    id?: string
    username: string
    email: string
    passwordHash: string
    emailVerified?: boolean
    isActive?: boolean
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    profile?: UserProfileUncheckedCreateNestedOneWithoutUserInput
    influenceMetrics?: InfluenceMetricsUncheckedCreateNestedOneWithoutUserInput
    settings?: SettingsUncheckedCreateNestedOneWithoutUserInput
    posts?: PostUncheckedCreateNestedManyWithoutAuthorInput
    reactions?: ReactionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserAccountCreateOrConnectWithoutPoliticalAlignmentInput = {
    where: UserAccountWhereUniqueInput
    create: XOR<UserAccountCreateWithoutPoliticalAlignmentInput, UserAccountUncheckedCreateWithoutPoliticalAlignmentInput>
  }

  export type PersonaCreateWithoutPoliticalAlignmentInput = {
    id?: string
    name: string
    handle: string
    bio: string
    profileImageUrl: string
    personaType: $Enums.PersonaType
    personalityTraits?: PersonaCreatepersonalityTraitsInput | string[]
    interests?: PersonaCreateinterestsInput | string[]
    expertise?: PersonaCreateexpertiseInput | string[]
    toneStyle?: $Enums.ToneStyle
    controversyTolerance?: number
    engagementFrequency?: number
    debateAggression?: number
    aiProvider?: string
    systemPrompt: string
    contextWindow?: number
    postingSchedule: JsonNullValueInput | InputJsonValue
    timezonePreference?: string
    isActive?: boolean
    isDefault?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    posts?: PostCreateNestedManyWithoutPersonaInput
  }

  export type PersonaUncheckedCreateWithoutPoliticalAlignmentInput = {
    id?: string
    name: string
    handle: string
    bio: string
    profileImageUrl: string
    personaType: $Enums.PersonaType
    personalityTraits?: PersonaCreatepersonalityTraitsInput | string[]
    interests?: PersonaCreateinterestsInput | string[]
    expertise?: PersonaCreateexpertiseInput | string[]
    toneStyle?: $Enums.ToneStyle
    controversyTolerance?: number
    engagementFrequency?: number
    debateAggression?: number
    aiProvider?: string
    systemPrompt: string
    contextWindow?: number
    postingSchedule: JsonNullValueInput | InputJsonValue
    timezonePreference?: string
    isActive?: boolean
    isDefault?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    posts?: PostUncheckedCreateNestedManyWithoutPersonaInput
  }

  export type PersonaCreateOrConnectWithoutPoliticalAlignmentInput = {
    where: PersonaWhereUniqueInput
    create: XOR<PersonaCreateWithoutPoliticalAlignmentInput, PersonaUncheckedCreateWithoutPoliticalAlignmentInput>
  }

  export type PersonaCreateManyPoliticalAlignmentInputEnvelope = {
    data: PersonaCreateManyPoliticalAlignmentInput | PersonaCreateManyPoliticalAlignmentInput[]
    skipDuplicates?: boolean
  }

  export type UserAccountUpsertWithoutPoliticalAlignmentInput = {
    update: XOR<UserAccountUpdateWithoutPoliticalAlignmentInput, UserAccountUncheckedUpdateWithoutPoliticalAlignmentInput>
    create: XOR<UserAccountCreateWithoutPoliticalAlignmentInput, UserAccountUncheckedCreateWithoutPoliticalAlignmentInput>
    where?: UserAccountWhereInput
  }

  export type UserAccountUpdateToOneWithWhereWithoutPoliticalAlignmentInput = {
    where?: UserAccountWhereInput
    data: XOR<UserAccountUpdateWithoutPoliticalAlignmentInput, UserAccountUncheckedUpdateWithoutPoliticalAlignmentInput>
  }

  export type UserAccountUpdateWithoutPoliticalAlignmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: UserProfileUpdateOneWithoutUserNestedInput
    influenceMetrics?: InfluenceMetricsUpdateOneWithoutUserNestedInput
    settings?: SettingsUpdateOneWithoutUserNestedInput
    posts?: PostUpdateManyWithoutAuthorNestedInput
    reactions?: ReactionUpdateManyWithoutUserNestedInput
  }

  export type UserAccountUncheckedUpdateWithoutPoliticalAlignmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: UserProfileUncheckedUpdateOneWithoutUserNestedInput
    influenceMetrics?: InfluenceMetricsUncheckedUpdateOneWithoutUserNestedInput
    settings?: SettingsUncheckedUpdateOneWithoutUserNestedInput
    posts?: PostUncheckedUpdateManyWithoutAuthorNestedInput
    reactions?: ReactionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type PersonaUpsertWithWhereUniqueWithoutPoliticalAlignmentInput = {
    where: PersonaWhereUniqueInput
    update: XOR<PersonaUpdateWithoutPoliticalAlignmentInput, PersonaUncheckedUpdateWithoutPoliticalAlignmentInput>
    create: XOR<PersonaCreateWithoutPoliticalAlignmentInput, PersonaUncheckedCreateWithoutPoliticalAlignmentInput>
  }

  export type PersonaUpdateWithWhereUniqueWithoutPoliticalAlignmentInput = {
    where: PersonaWhereUniqueInput
    data: XOR<PersonaUpdateWithoutPoliticalAlignmentInput, PersonaUncheckedUpdateWithoutPoliticalAlignmentInput>
  }

  export type PersonaUpdateManyWithWhereWithoutPoliticalAlignmentInput = {
    where: PersonaScalarWhereInput
    data: XOR<PersonaUpdateManyMutationInput, PersonaUncheckedUpdateManyWithoutPoliticalAlignmentInput>
  }

  export type PersonaScalarWhereInput = {
    AND?: PersonaScalarWhereInput | PersonaScalarWhereInput[]
    OR?: PersonaScalarWhereInput[]
    NOT?: PersonaScalarWhereInput | PersonaScalarWhereInput[]
    id?: StringFilter<"Persona"> | string
    name?: StringFilter<"Persona"> | string
    handle?: StringFilter<"Persona"> | string
    bio?: StringFilter<"Persona"> | string
    profileImageUrl?: StringFilter<"Persona"> | string
    personaType?: EnumPersonaTypeFilter<"Persona"> | $Enums.PersonaType
    personalityTraits?: StringNullableListFilter<"Persona">
    interests?: StringNullableListFilter<"Persona">
    expertise?: StringNullableListFilter<"Persona">
    toneStyle?: EnumToneStyleFilter<"Persona"> | $Enums.ToneStyle
    controversyTolerance?: IntFilter<"Persona"> | number
    engagementFrequency?: IntFilter<"Persona"> | number
    debateAggression?: IntFilter<"Persona"> | number
    politicalAlignmentId?: StringFilter<"Persona"> | string
    aiProvider?: StringFilter<"Persona"> | string
    systemPrompt?: StringFilter<"Persona"> | string
    contextWindow?: IntFilter<"Persona"> | number
    postingSchedule?: JsonFilter<"Persona">
    timezonePreference?: StringFilter<"Persona"> | string
    isActive?: BoolFilter<"Persona"> | boolean
    isDefault?: BoolFilter<"Persona"> | boolean
    createdAt?: DateTimeFilter<"Persona"> | Date | string
    updatedAt?: DateTimeFilter<"Persona"> | Date | string
  }

  export type UserAccountCreateWithoutInfluenceMetricsInput = {
    id?: string
    username: string
    email: string
    passwordHash: string
    emailVerified?: boolean
    isActive?: boolean
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    profile?: UserProfileCreateNestedOneWithoutUserInput
    politicalAlignment?: PoliticalAlignmentCreateNestedOneWithoutUserInput
    settings?: SettingsCreateNestedOneWithoutUserInput
    posts?: PostCreateNestedManyWithoutAuthorInput
    reactions?: ReactionCreateNestedManyWithoutUserInput
  }

  export type UserAccountUncheckedCreateWithoutInfluenceMetricsInput = {
    id?: string
    username: string
    email: string
    passwordHash: string
    emailVerified?: boolean
    isActive?: boolean
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    profile?: UserProfileUncheckedCreateNestedOneWithoutUserInput
    politicalAlignment?: PoliticalAlignmentUncheckedCreateNestedOneWithoutUserInput
    settings?: SettingsUncheckedCreateNestedOneWithoutUserInput
    posts?: PostUncheckedCreateNestedManyWithoutAuthorInput
    reactions?: ReactionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserAccountCreateOrConnectWithoutInfluenceMetricsInput = {
    where: UserAccountWhereUniqueInput
    create: XOR<UserAccountCreateWithoutInfluenceMetricsInput, UserAccountUncheckedCreateWithoutInfluenceMetricsInput>
  }

  export type UserAccountUpsertWithoutInfluenceMetricsInput = {
    update: XOR<UserAccountUpdateWithoutInfluenceMetricsInput, UserAccountUncheckedUpdateWithoutInfluenceMetricsInput>
    create: XOR<UserAccountCreateWithoutInfluenceMetricsInput, UserAccountUncheckedCreateWithoutInfluenceMetricsInput>
    where?: UserAccountWhereInput
  }

  export type UserAccountUpdateToOneWithWhereWithoutInfluenceMetricsInput = {
    where?: UserAccountWhereInput
    data: XOR<UserAccountUpdateWithoutInfluenceMetricsInput, UserAccountUncheckedUpdateWithoutInfluenceMetricsInput>
  }

  export type UserAccountUpdateWithoutInfluenceMetricsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: UserProfileUpdateOneWithoutUserNestedInput
    politicalAlignment?: PoliticalAlignmentUpdateOneWithoutUserNestedInput
    settings?: SettingsUpdateOneWithoutUserNestedInput
    posts?: PostUpdateManyWithoutAuthorNestedInput
    reactions?: ReactionUpdateManyWithoutUserNestedInput
  }

  export type UserAccountUncheckedUpdateWithoutInfluenceMetricsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: UserProfileUncheckedUpdateOneWithoutUserNestedInput
    politicalAlignment?: PoliticalAlignmentUncheckedUpdateOneWithoutUserNestedInput
    settings?: SettingsUncheckedUpdateOneWithoutUserNestedInput
    posts?: PostUncheckedUpdateManyWithoutAuthorNestedInput
    reactions?: ReactionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserAccountCreateWithoutSettingsInput = {
    id?: string
    username: string
    email: string
    passwordHash: string
    emailVerified?: boolean
    isActive?: boolean
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    profile?: UserProfileCreateNestedOneWithoutUserInput
    politicalAlignment?: PoliticalAlignmentCreateNestedOneWithoutUserInput
    influenceMetrics?: InfluenceMetricsCreateNestedOneWithoutUserInput
    posts?: PostCreateNestedManyWithoutAuthorInput
    reactions?: ReactionCreateNestedManyWithoutUserInput
  }

  export type UserAccountUncheckedCreateWithoutSettingsInput = {
    id?: string
    username: string
    email: string
    passwordHash: string
    emailVerified?: boolean
    isActive?: boolean
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    profile?: UserProfileUncheckedCreateNestedOneWithoutUserInput
    politicalAlignment?: PoliticalAlignmentUncheckedCreateNestedOneWithoutUserInput
    influenceMetrics?: InfluenceMetricsUncheckedCreateNestedOneWithoutUserInput
    posts?: PostUncheckedCreateNestedManyWithoutAuthorInput
    reactions?: ReactionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserAccountCreateOrConnectWithoutSettingsInput = {
    where: UserAccountWhereUniqueInput
    create: XOR<UserAccountCreateWithoutSettingsInput, UserAccountUncheckedCreateWithoutSettingsInput>
  }

  export type UserAccountUpsertWithoutSettingsInput = {
    update: XOR<UserAccountUpdateWithoutSettingsInput, UserAccountUncheckedUpdateWithoutSettingsInput>
    create: XOR<UserAccountCreateWithoutSettingsInput, UserAccountUncheckedCreateWithoutSettingsInput>
    where?: UserAccountWhereInput
  }

  export type UserAccountUpdateToOneWithWhereWithoutSettingsInput = {
    where?: UserAccountWhereInput
    data: XOR<UserAccountUpdateWithoutSettingsInput, UserAccountUncheckedUpdateWithoutSettingsInput>
  }

  export type UserAccountUpdateWithoutSettingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: UserProfileUpdateOneWithoutUserNestedInput
    politicalAlignment?: PoliticalAlignmentUpdateOneWithoutUserNestedInput
    influenceMetrics?: InfluenceMetricsUpdateOneWithoutUserNestedInput
    posts?: PostUpdateManyWithoutAuthorNestedInput
    reactions?: ReactionUpdateManyWithoutUserNestedInput
  }

  export type UserAccountUncheckedUpdateWithoutSettingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: UserProfileUncheckedUpdateOneWithoutUserNestedInput
    politicalAlignment?: PoliticalAlignmentUncheckedUpdateOneWithoutUserNestedInput
    influenceMetrics?: InfluenceMetricsUncheckedUpdateOneWithoutUserNestedInput
    posts?: PostUncheckedUpdateManyWithoutAuthorNestedInput
    reactions?: ReactionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserAccountCreateWithoutPostsInput = {
    id?: string
    username: string
    email: string
    passwordHash: string
    emailVerified?: boolean
    isActive?: boolean
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    profile?: UserProfileCreateNestedOneWithoutUserInput
    politicalAlignment?: PoliticalAlignmentCreateNestedOneWithoutUserInput
    influenceMetrics?: InfluenceMetricsCreateNestedOneWithoutUserInput
    settings?: SettingsCreateNestedOneWithoutUserInput
    reactions?: ReactionCreateNestedManyWithoutUserInput
  }

  export type UserAccountUncheckedCreateWithoutPostsInput = {
    id?: string
    username: string
    email: string
    passwordHash: string
    emailVerified?: boolean
    isActive?: boolean
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    profile?: UserProfileUncheckedCreateNestedOneWithoutUserInput
    politicalAlignment?: PoliticalAlignmentUncheckedCreateNestedOneWithoutUserInput
    influenceMetrics?: InfluenceMetricsUncheckedCreateNestedOneWithoutUserInput
    settings?: SettingsUncheckedCreateNestedOneWithoutUserInput
    reactions?: ReactionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserAccountCreateOrConnectWithoutPostsInput = {
    where: UserAccountWhereUniqueInput
    create: XOR<UserAccountCreateWithoutPostsInput, UserAccountUncheckedCreateWithoutPostsInput>
  }

  export type PersonaCreateWithoutPostsInput = {
    id?: string
    name: string
    handle: string
    bio: string
    profileImageUrl: string
    personaType: $Enums.PersonaType
    personalityTraits?: PersonaCreatepersonalityTraitsInput | string[]
    interests?: PersonaCreateinterestsInput | string[]
    expertise?: PersonaCreateexpertiseInput | string[]
    toneStyle?: $Enums.ToneStyle
    controversyTolerance?: number
    engagementFrequency?: number
    debateAggression?: number
    aiProvider?: string
    systemPrompt: string
    contextWindow?: number
    postingSchedule: JsonNullValueInput | InputJsonValue
    timezonePreference?: string
    isActive?: boolean
    isDefault?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    politicalAlignment: PoliticalAlignmentCreateNestedOneWithoutPersonasInput
  }

  export type PersonaUncheckedCreateWithoutPostsInput = {
    id?: string
    name: string
    handle: string
    bio: string
    profileImageUrl: string
    personaType: $Enums.PersonaType
    personalityTraits?: PersonaCreatepersonalityTraitsInput | string[]
    interests?: PersonaCreateinterestsInput | string[]
    expertise?: PersonaCreateexpertiseInput | string[]
    toneStyle?: $Enums.ToneStyle
    controversyTolerance?: number
    engagementFrequency?: number
    debateAggression?: number
    politicalAlignmentId: string
    aiProvider?: string
    systemPrompt: string
    contextWindow?: number
    postingSchedule: JsonNullValueInput | InputJsonValue
    timezonePreference?: string
    isActive?: boolean
    isDefault?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PersonaCreateOrConnectWithoutPostsInput = {
    where: PersonaWhereUniqueInput
    create: XOR<PersonaCreateWithoutPostsInput, PersonaUncheckedCreateWithoutPostsInput>
  }

  export type ThreadCreateWithoutPostsInput = {
    id?: string
    originalPostId: string
    title?: string | null
    participantCount?: number
    postCount?: number
    maxDepth?: number
    totalLikes?: number
    totalReshares?: number
    lastActivityAt?: Date | string
    isLocked?: boolean
    isHidden?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ThreadUncheckedCreateWithoutPostsInput = {
    id?: string
    originalPostId: string
    title?: string | null
    participantCount?: number
    postCount?: number
    maxDepth?: number
    totalLikes?: number
    totalReshares?: number
    lastActivityAt?: Date | string
    isLocked?: boolean
    isHidden?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ThreadCreateOrConnectWithoutPostsInput = {
    where: ThreadWhereUniqueInput
    create: XOR<ThreadCreateWithoutPostsInput, ThreadUncheckedCreateWithoutPostsInput>
  }

  export type PostCreateWithoutRepliesInput = {
    id?: string
    content: string
    mediaUrls?: PostCreatemediaUrlsInput | string[]
    linkPreview?: NullableJsonNullValueInput | InputJsonValue
    isAIGenerated?: boolean
    hashtags?: PostCreatehashtagsInput | string[]
    mentions?: PostCreatementionsInput | string[]
    newsContext?: string | null
    likeCount?: number
    repostCount?: number
    commentCount?: number
    impressionCount?: number
    contentWarning?: string | null
    isHidden?: boolean
    reportCount?: number
    publishedAt?: Date | string
    editedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    author: UserAccountCreateNestedOneWithoutPostsInput
    persona?: PersonaCreateNestedOneWithoutPostsInput
    thread: ThreadCreateNestedOneWithoutPostsInput
    parentPost?: PostCreateNestedOneWithoutRepliesInput
    repostOf?: PostCreateNestedOneWithoutRepostsInput
    newsItem?: NewsItemCreateNestedOneWithoutRelatedPostsInput
    reposts?: PostCreateNestedManyWithoutRepostOfInput
    reactions?: ReactionCreateNestedManyWithoutPostInput
  }

  export type PostUncheckedCreateWithoutRepliesInput = {
    id?: string
    authorId: string
    personaId?: string | null
    content: string
    mediaUrls?: PostCreatemediaUrlsInput | string[]
    linkPreview?: NullableJsonNullValueInput | InputJsonValue
    threadId: string
    parentPostId?: string | null
    repostOfId?: string | null
    isAIGenerated?: boolean
    hashtags?: PostCreatehashtagsInput | string[]
    mentions?: PostCreatementionsInput | string[]
    newsItemId?: string | null
    newsContext?: string | null
    likeCount?: number
    repostCount?: number
    commentCount?: number
    impressionCount?: number
    contentWarning?: string | null
    isHidden?: boolean
    reportCount?: number
    publishedAt?: Date | string
    editedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    reposts?: PostUncheckedCreateNestedManyWithoutRepostOfInput
    reactions?: ReactionUncheckedCreateNestedManyWithoutPostInput
  }

  export type PostCreateOrConnectWithoutRepliesInput = {
    where: PostWhereUniqueInput
    create: XOR<PostCreateWithoutRepliesInput, PostUncheckedCreateWithoutRepliesInput>
  }

  export type PostCreateWithoutRepostsInput = {
    id?: string
    content: string
    mediaUrls?: PostCreatemediaUrlsInput | string[]
    linkPreview?: NullableJsonNullValueInput | InputJsonValue
    isAIGenerated?: boolean
    hashtags?: PostCreatehashtagsInput | string[]
    mentions?: PostCreatementionsInput | string[]
    newsContext?: string | null
    likeCount?: number
    repostCount?: number
    commentCount?: number
    impressionCount?: number
    contentWarning?: string | null
    isHidden?: boolean
    reportCount?: number
    publishedAt?: Date | string
    editedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    author: UserAccountCreateNestedOneWithoutPostsInput
    persona?: PersonaCreateNestedOneWithoutPostsInput
    thread: ThreadCreateNestedOneWithoutPostsInput
    parentPost?: PostCreateNestedOneWithoutRepliesInput
    repostOf?: PostCreateNestedOneWithoutRepostsInput
    newsItem?: NewsItemCreateNestedOneWithoutRelatedPostsInput
    replies?: PostCreateNestedManyWithoutParentPostInput
    reactions?: ReactionCreateNestedManyWithoutPostInput
  }

  export type PostUncheckedCreateWithoutRepostsInput = {
    id?: string
    authorId: string
    personaId?: string | null
    content: string
    mediaUrls?: PostCreatemediaUrlsInput | string[]
    linkPreview?: NullableJsonNullValueInput | InputJsonValue
    threadId: string
    parentPostId?: string | null
    repostOfId?: string | null
    isAIGenerated?: boolean
    hashtags?: PostCreatehashtagsInput | string[]
    mentions?: PostCreatementionsInput | string[]
    newsItemId?: string | null
    newsContext?: string | null
    likeCount?: number
    repostCount?: number
    commentCount?: number
    impressionCount?: number
    contentWarning?: string | null
    isHidden?: boolean
    reportCount?: number
    publishedAt?: Date | string
    editedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    replies?: PostUncheckedCreateNestedManyWithoutParentPostInput
    reactions?: ReactionUncheckedCreateNestedManyWithoutPostInput
  }

  export type PostCreateOrConnectWithoutRepostsInput = {
    where: PostWhereUniqueInput
    create: XOR<PostCreateWithoutRepostsInput, PostUncheckedCreateWithoutRepostsInput>
  }

  export type NewsItemCreateWithoutRelatedPostsInput = {
    id?: string
    title: string
    description: string
    content?: string | null
    url: string
    sourceName: string
    sourceUrl: string
    author?: string | null
    category?: $Enums.NewsCategory
    topics?: NewsItemCreatetopicsInput | string[]
    keywords?: NewsItemCreatekeywordsInput | string[]
    entities?: NewsItemCreateentitiesInput | string[]
    country?: string | null
    region?: string | null
    language?: string
    sentimentScore?: number
    impactScore?: number
    controversyScore?: number
    publishedAt: Date | string
    discoveredAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    aiSummary?: string | null
    topicTags?: NewsItemCreatetopicTagsInput | string[]
    trends?: TrendCreateNestedManyWithoutNewsItemsInput
  }

  export type NewsItemUncheckedCreateWithoutRelatedPostsInput = {
    id?: string
    title: string
    description: string
    content?: string | null
    url: string
    sourceName: string
    sourceUrl: string
    author?: string | null
    category?: $Enums.NewsCategory
    topics?: NewsItemCreatetopicsInput | string[]
    keywords?: NewsItemCreatekeywordsInput | string[]
    entities?: NewsItemCreateentitiesInput | string[]
    country?: string | null
    region?: string | null
    language?: string
    sentimentScore?: number
    impactScore?: number
    controversyScore?: number
    publishedAt: Date | string
    discoveredAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    aiSummary?: string | null
    topicTags?: NewsItemCreatetopicTagsInput | string[]
    trends?: TrendUncheckedCreateNestedManyWithoutNewsItemsInput
  }

  export type NewsItemCreateOrConnectWithoutRelatedPostsInput = {
    where: NewsItemWhereUniqueInput
    create: XOR<NewsItemCreateWithoutRelatedPostsInput, NewsItemUncheckedCreateWithoutRelatedPostsInput>
  }

  export type PostCreateWithoutParentPostInput = {
    id?: string
    content: string
    mediaUrls?: PostCreatemediaUrlsInput | string[]
    linkPreview?: NullableJsonNullValueInput | InputJsonValue
    isAIGenerated?: boolean
    hashtags?: PostCreatehashtagsInput | string[]
    mentions?: PostCreatementionsInput | string[]
    newsContext?: string | null
    likeCount?: number
    repostCount?: number
    commentCount?: number
    impressionCount?: number
    contentWarning?: string | null
    isHidden?: boolean
    reportCount?: number
    publishedAt?: Date | string
    editedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    author: UserAccountCreateNestedOneWithoutPostsInput
    persona?: PersonaCreateNestedOneWithoutPostsInput
    thread: ThreadCreateNestedOneWithoutPostsInput
    repostOf?: PostCreateNestedOneWithoutRepostsInput
    newsItem?: NewsItemCreateNestedOneWithoutRelatedPostsInput
    replies?: PostCreateNestedManyWithoutParentPostInput
    reposts?: PostCreateNestedManyWithoutRepostOfInput
    reactions?: ReactionCreateNestedManyWithoutPostInput
  }

  export type PostUncheckedCreateWithoutParentPostInput = {
    id?: string
    authorId: string
    personaId?: string | null
    content: string
    mediaUrls?: PostCreatemediaUrlsInput | string[]
    linkPreview?: NullableJsonNullValueInput | InputJsonValue
    threadId: string
    repostOfId?: string | null
    isAIGenerated?: boolean
    hashtags?: PostCreatehashtagsInput | string[]
    mentions?: PostCreatementionsInput | string[]
    newsItemId?: string | null
    newsContext?: string | null
    likeCount?: number
    repostCount?: number
    commentCount?: number
    impressionCount?: number
    contentWarning?: string | null
    isHidden?: boolean
    reportCount?: number
    publishedAt?: Date | string
    editedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    replies?: PostUncheckedCreateNestedManyWithoutParentPostInput
    reposts?: PostUncheckedCreateNestedManyWithoutRepostOfInput
    reactions?: ReactionUncheckedCreateNestedManyWithoutPostInput
  }

  export type PostCreateOrConnectWithoutParentPostInput = {
    where: PostWhereUniqueInput
    create: XOR<PostCreateWithoutParentPostInput, PostUncheckedCreateWithoutParentPostInput>
  }

  export type PostCreateManyParentPostInputEnvelope = {
    data: PostCreateManyParentPostInput | PostCreateManyParentPostInput[]
    skipDuplicates?: boolean
  }

  export type PostCreateWithoutRepostOfInput = {
    id?: string
    content: string
    mediaUrls?: PostCreatemediaUrlsInput | string[]
    linkPreview?: NullableJsonNullValueInput | InputJsonValue
    isAIGenerated?: boolean
    hashtags?: PostCreatehashtagsInput | string[]
    mentions?: PostCreatementionsInput | string[]
    newsContext?: string | null
    likeCount?: number
    repostCount?: number
    commentCount?: number
    impressionCount?: number
    contentWarning?: string | null
    isHidden?: boolean
    reportCount?: number
    publishedAt?: Date | string
    editedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    author: UserAccountCreateNestedOneWithoutPostsInput
    persona?: PersonaCreateNestedOneWithoutPostsInput
    thread: ThreadCreateNestedOneWithoutPostsInput
    parentPost?: PostCreateNestedOneWithoutRepliesInput
    newsItem?: NewsItemCreateNestedOneWithoutRelatedPostsInput
    replies?: PostCreateNestedManyWithoutParentPostInput
    reposts?: PostCreateNestedManyWithoutRepostOfInput
    reactions?: ReactionCreateNestedManyWithoutPostInput
  }

  export type PostUncheckedCreateWithoutRepostOfInput = {
    id?: string
    authorId: string
    personaId?: string | null
    content: string
    mediaUrls?: PostCreatemediaUrlsInput | string[]
    linkPreview?: NullableJsonNullValueInput | InputJsonValue
    threadId: string
    parentPostId?: string | null
    isAIGenerated?: boolean
    hashtags?: PostCreatehashtagsInput | string[]
    mentions?: PostCreatementionsInput | string[]
    newsItemId?: string | null
    newsContext?: string | null
    likeCount?: number
    repostCount?: number
    commentCount?: number
    impressionCount?: number
    contentWarning?: string | null
    isHidden?: boolean
    reportCount?: number
    publishedAt?: Date | string
    editedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    replies?: PostUncheckedCreateNestedManyWithoutParentPostInput
    reposts?: PostUncheckedCreateNestedManyWithoutRepostOfInput
    reactions?: ReactionUncheckedCreateNestedManyWithoutPostInput
  }

  export type PostCreateOrConnectWithoutRepostOfInput = {
    where: PostWhereUniqueInput
    create: XOR<PostCreateWithoutRepostOfInput, PostUncheckedCreateWithoutRepostOfInput>
  }

  export type PostCreateManyRepostOfInputEnvelope = {
    data: PostCreateManyRepostOfInput | PostCreateManyRepostOfInput[]
    skipDuplicates?: boolean
  }

  export type ReactionCreateWithoutPostInput = {
    id?: string
    type: $Enums.ReactionType
    createdAt?: Date | string
    user: UserAccountCreateNestedOneWithoutReactionsInput
  }

  export type ReactionUncheckedCreateWithoutPostInput = {
    id?: string
    userId: string
    type: $Enums.ReactionType
    createdAt?: Date | string
  }

  export type ReactionCreateOrConnectWithoutPostInput = {
    where: ReactionWhereUniqueInput
    create: XOR<ReactionCreateWithoutPostInput, ReactionUncheckedCreateWithoutPostInput>
  }

  export type ReactionCreateManyPostInputEnvelope = {
    data: ReactionCreateManyPostInput | ReactionCreateManyPostInput[]
    skipDuplicates?: boolean
  }

  export type UserAccountUpsertWithoutPostsInput = {
    update: XOR<UserAccountUpdateWithoutPostsInput, UserAccountUncheckedUpdateWithoutPostsInput>
    create: XOR<UserAccountCreateWithoutPostsInput, UserAccountUncheckedCreateWithoutPostsInput>
    where?: UserAccountWhereInput
  }

  export type UserAccountUpdateToOneWithWhereWithoutPostsInput = {
    where?: UserAccountWhereInput
    data: XOR<UserAccountUpdateWithoutPostsInput, UserAccountUncheckedUpdateWithoutPostsInput>
  }

  export type UserAccountUpdateWithoutPostsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: UserProfileUpdateOneWithoutUserNestedInput
    politicalAlignment?: PoliticalAlignmentUpdateOneWithoutUserNestedInput
    influenceMetrics?: InfluenceMetricsUpdateOneWithoutUserNestedInput
    settings?: SettingsUpdateOneWithoutUserNestedInput
    reactions?: ReactionUpdateManyWithoutUserNestedInput
  }

  export type UserAccountUncheckedUpdateWithoutPostsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: UserProfileUncheckedUpdateOneWithoutUserNestedInput
    politicalAlignment?: PoliticalAlignmentUncheckedUpdateOneWithoutUserNestedInput
    influenceMetrics?: InfluenceMetricsUncheckedUpdateOneWithoutUserNestedInput
    settings?: SettingsUncheckedUpdateOneWithoutUserNestedInput
    reactions?: ReactionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type PersonaUpsertWithoutPostsInput = {
    update: XOR<PersonaUpdateWithoutPostsInput, PersonaUncheckedUpdateWithoutPostsInput>
    create: XOR<PersonaCreateWithoutPostsInput, PersonaUncheckedCreateWithoutPostsInput>
    where?: PersonaWhereInput
  }

  export type PersonaUpdateToOneWithWhereWithoutPostsInput = {
    where?: PersonaWhereInput
    data: XOR<PersonaUpdateWithoutPostsInput, PersonaUncheckedUpdateWithoutPostsInput>
  }

  export type PersonaUpdateWithoutPostsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    handle?: StringFieldUpdateOperationsInput | string
    bio?: StringFieldUpdateOperationsInput | string
    profileImageUrl?: StringFieldUpdateOperationsInput | string
    personaType?: EnumPersonaTypeFieldUpdateOperationsInput | $Enums.PersonaType
    personalityTraits?: PersonaUpdatepersonalityTraitsInput | string[]
    interests?: PersonaUpdateinterestsInput | string[]
    expertise?: PersonaUpdateexpertiseInput | string[]
    toneStyle?: EnumToneStyleFieldUpdateOperationsInput | $Enums.ToneStyle
    controversyTolerance?: IntFieldUpdateOperationsInput | number
    engagementFrequency?: IntFieldUpdateOperationsInput | number
    debateAggression?: IntFieldUpdateOperationsInput | number
    aiProvider?: StringFieldUpdateOperationsInput | string
    systemPrompt?: StringFieldUpdateOperationsInput | string
    contextWindow?: IntFieldUpdateOperationsInput | number
    postingSchedule?: JsonNullValueInput | InputJsonValue
    timezonePreference?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    politicalAlignment?: PoliticalAlignmentUpdateOneRequiredWithoutPersonasNestedInput
  }

  export type PersonaUncheckedUpdateWithoutPostsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    handle?: StringFieldUpdateOperationsInput | string
    bio?: StringFieldUpdateOperationsInput | string
    profileImageUrl?: StringFieldUpdateOperationsInput | string
    personaType?: EnumPersonaTypeFieldUpdateOperationsInput | $Enums.PersonaType
    personalityTraits?: PersonaUpdatepersonalityTraitsInput | string[]
    interests?: PersonaUpdateinterestsInput | string[]
    expertise?: PersonaUpdateexpertiseInput | string[]
    toneStyle?: EnumToneStyleFieldUpdateOperationsInput | $Enums.ToneStyle
    controversyTolerance?: IntFieldUpdateOperationsInput | number
    engagementFrequency?: IntFieldUpdateOperationsInput | number
    debateAggression?: IntFieldUpdateOperationsInput | number
    politicalAlignmentId?: StringFieldUpdateOperationsInput | string
    aiProvider?: StringFieldUpdateOperationsInput | string
    systemPrompt?: StringFieldUpdateOperationsInput | string
    contextWindow?: IntFieldUpdateOperationsInput | number
    postingSchedule?: JsonNullValueInput | InputJsonValue
    timezonePreference?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ThreadUpsertWithoutPostsInput = {
    update: XOR<ThreadUpdateWithoutPostsInput, ThreadUncheckedUpdateWithoutPostsInput>
    create: XOR<ThreadCreateWithoutPostsInput, ThreadUncheckedCreateWithoutPostsInput>
    where?: ThreadWhereInput
  }

  export type ThreadUpdateToOneWithWhereWithoutPostsInput = {
    where?: ThreadWhereInput
    data: XOR<ThreadUpdateWithoutPostsInput, ThreadUncheckedUpdateWithoutPostsInput>
  }

  export type ThreadUpdateWithoutPostsInput = {
    id?: StringFieldUpdateOperationsInput | string
    originalPostId?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    participantCount?: IntFieldUpdateOperationsInput | number
    postCount?: IntFieldUpdateOperationsInput | number
    maxDepth?: IntFieldUpdateOperationsInput | number
    totalLikes?: IntFieldUpdateOperationsInput | number
    totalReshares?: IntFieldUpdateOperationsInput | number
    lastActivityAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isLocked?: BoolFieldUpdateOperationsInput | boolean
    isHidden?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ThreadUncheckedUpdateWithoutPostsInput = {
    id?: StringFieldUpdateOperationsInput | string
    originalPostId?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    participantCount?: IntFieldUpdateOperationsInput | number
    postCount?: IntFieldUpdateOperationsInput | number
    maxDepth?: IntFieldUpdateOperationsInput | number
    totalLikes?: IntFieldUpdateOperationsInput | number
    totalReshares?: IntFieldUpdateOperationsInput | number
    lastActivityAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isLocked?: BoolFieldUpdateOperationsInput | boolean
    isHidden?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PostUpsertWithoutRepliesInput = {
    update: XOR<PostUpdateWithoutRepliesInput, PostUncheckedUpdateWithoutRepliesInput>
    create: XOR<PostCreateWithoutRepliesInput, PostUncheckedCreateWithoutRepliesInput>
    where?: PostWhereInput
  }

  export type PostUpdateToOneWithWhereWithoutRepliesInput = {
    where?: PostWhereInput
    data: XOR<PostUpdateWithoutRepliesInput, PostUncheckedUpdateWithoutRepliesInput>
  }

  export type PostUpdateWithoutRepliesInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    mediaUrls?: PostUpdatemediaUrlsInput | string[]
    linkPreview?: NullableJsonNullValueInput | InputJsonValue
    isAIGenerated?: BoolFieldUpdateOperationsInput | boolean
    hashtags?: PostUpdatehashtagsInput | string[]
    mentions?: PostUpdatementionsInput | string[]
    newsContext?: NullableStringFieldUpdateOperationsInput | string | null
    likeCount?: IntFieldUpdateOperationsInput | number
    repostCount?: IntFieldUpdateOperationsInput | number
    commentCount?: IntFieldUpdateOperationsInput | number
    impressionCount?: IntFieldUpdateOperationsInput | number
    contentWarning?: NullableStringFieldUpdateOperationsInput | string | null
    isHidden?: BoolFieldUpdateOperationsInput | boolean
    reportCount?: IntFieldUpdateOperationsInput | number
    publishedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    editedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    author?: UserAccountUpdateOneRequiredWithoutPostsNestedInput
    persona?: PersonaUpdateOneWithoutPostsNestedInput
    thread?: ThreadUpdateOneRequiredWithoutPostsNestedInput
    parentPost?: PostUpdateOneWithoutRepliesNestedInput
    repostOf?: PostUpdateOneWithoutRepostsNestedInput
    newsItem?: NewsItemUpdateOneWithoutRelatedPostsNestedInput
    reposts?: PostUpdateManyWithoutRepostOfNestedInput
    reactions?: ReactionUpdateManyWithoutPostNestedInput
  }

  export type PostUncheckedUpdateWithoutRepliesInput = {
    id?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    personaId?: NullableStringFieldUpdateOperationsInput | string | null
    content?: StringFieldUpdateOperationsInput | string
    mediaUrls?: PostUpdatemediaUrlsInput | string[]
    linkPreview?: NullableJsonNullValueInput | InputJsonValue
    threadId?: StringFieldUpdateOperationsInput | string
    parentPostId?: NullableStringFieldUpdateOperationsInput | string | null
    repostOfId?: NullableStringFieldUpdateOperationsInput | string | null
    isAIGenerated?: BoolFieldUpdateOperationsInput | boolean
    hashtags?: PostUpdatehashtagsInput | string[]
    mentions?: PostUpdatementionsInput | string[]
    newsItemId?: NullableStringFieldUpdateOperationsInput | string | null
    newsContext?: NullableStringFieldUpdateOperationsInput | string | null
    likeCount?: IntFieldUpdateOperationsInput | number
    repostCount?: IntFieldUpdateOperationsInput | number
    commentCount?: IntFieldUpdateOperationsInput | number
    impressionCount?: IntFieldUpdateOperationsInput | number
    contentWarning?: NullableStringFieldUpdateOperationsInput | string | null
    isHidden?: BoolFieldUpdateOperationsInput | boolean
    reportCount?: IntFieldUpdateOperationsInput | number
    publishedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    editedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reposts?: PostUncheckedUpdateManyWithoutRepostOfNestedInput
    reactions?: ReactionUncheckedUpdateManyWithoutPostNestedInput
  }

  export type PostUpsertWithoutRepostsInput = {
    update: XOR<PostUpdateWithoutRepostsInput, PostUncheckedUpdateWithoutRepostsInput>
    create: XOR<PostCreateWithoutRepostsInput, PostUncheckedCreateWithoutRepostsInput>
    where?: PostWhereInput
  }

  export type PostUpdateToOneWithWhereWithoutRepostsInput = {
    where?: PostWhereInput
    data: XOR<PostUpdateWithoutRepostsInput, PostUncheckedUpdateWithoutRepostsInput>
  }

  export type PostUpdateWithoutRepostsInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    mediaUrls?: PostUpdatemediaUrlsInput | string[]
    linkPreview?: NullableJsonNullValueInput | InputJsonValue
    isAIGenerated?: BoolFieldUpdateOperationsInput | boolean
    hashtags?: PostUpdatehashtagsInput | string[]
    mentions?: PostUpdatementionsInput | string[]
    newsContext?: NullableStringFieldUpdateOperationsInput | string | null
    likeCount?: IntFieldUpdateOperationsInput | number
    repostCount?: IntFieldUpdateOperationsInput | number
    commentCount?: IntFieldUpdateOperationsInput | number
    impressionCount?: IntFieldUpdateOperationsInput | number
    contentWarning?: NullableStringFieldUpdateOperationsInput | string | null
    isHidden?: BoolFieldUpdateOperationsInput | boolean
    reportCount?: IntFieldUpdateOperationsInput | number
    publishedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    editedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    author?: UserAccountUpdateOneRequiredWithoutPostsNestedInput
    persona?: PersonaUpdateOneWithoutPostsNestedInput
    thread?: ThreadUpdateOneRequiredWithoutPostsNestedInput
    parentPost?: PostUpdateOneWithoutRepliesNestedInput
    repostOf?: PostUpdateOneWithoutRepostsNestedInput
    newsItem?: NewsItemUpdateOneWithoutRelatedPostsNestedInput
    replies?: PostUpdateManyWithoutParentPostNestedInput
    reactions?: ReactionUpdateManyWithoutPostNestedInput
  }

  export type PostUncheckedUpdateWithoutRepostsInput = {
    id?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    personaId?: NullableStringFieldUpdateOperationsInput | string | null
    content?: StringFieldUpdateOperationsInput | string
    mediaUrls?: PostUpdatemediaUrlsInput | string[]
    linkPreview?: NullableJsonNullValueInput | InputJsonValue
    threadId?: StringFieldUpdateOperationsInput | string
    parentPostId?: NullableStringFieldUpdateOperationsInput | string | null
    repostOfId?: NullableStringFieldUpdateOperationsInput | string | null
    isAIGenerated?: BoolFieldUpdateOperationsInput | boolean
    hashtags?: PostUpdatehashtagsInput | string[]
    mentions?: PostUpdatementionsInput | string[]
    newsItemId?: NullableStringFieldUpdateOperationsInput | string | null
    newsContext?: NullableStringFieldUpdateOperationsInput | string | null
    likeCount?: IntFieldUpdateOperationsInput | number
    repostCount?: IntFieldUpdateOperationsInput | number
    commentCount?: IntFieldUpdateOperationsInput | number
    impressionCount?: IntFieldUpdateOperationsInput | number
    contentWarning?: NullableStringFieldUpdateOperationsInput | string | null
    isHidden?: BoolFieldUpdateOperationsInput | boolean
    reportCount?: IntFieldUpdateOperationsInput | number
    publishedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    editedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    replies?: PostUncheckedUpdateManyWithoutParentPostNestedInput
    reactions?: ReactionUncheckedUpdateManyWithoutPostNestedInput
  }

  export type NewsItemUpsertWithoutRelatedPostsInput = {
    update: XOR<NewsItemUpdateWithoutRelatedPostsInput, NewsItemUncheckedUpdateWithoutRelatedPostsInput>
    create: XOR<NewsItemCreateWithoutRelatedPostsInput, NewsItemUncheckedCreateWithoutRelatedPostsInput>
    where?: NewsItemWhereInput
  }

  export type NewsItemUpdateToOneWithWhereWithoutRelatedPostsInput = {
    where?: NewsItemWhereInput
    data: XOR<NewsItemUpdateWithoutRelatedPostsInput, NewsItemUncheckedUpdateWithoutRelatedPostsInput>
  }

  export type NewsItemUpdateWithoutRelatedPostsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    url?: StringFieldUpdateOperationsInput | string
    sourceName?: StringFieldUpdateOperationsInput | string
    sourceUrl?: StringFieldUpdateOperationsInput | string
    author?: NullableStringFieldUpdateOperationsInput | string | null
    category?: EnumNewsCategoryFieldUpdateOperationsInput | $Enums.NewsCategory
    topics?: NewsItemUpdatetopicsInput | string[]
    keywords?: NewsItemUpdatekeywordsInput | string[]
    entities?: NewsItemUpdateentitiesInput | string[]
    country?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    language?: StringFieldUpdateOperationsInput | string
    sentimentScore?: FloatFieldUpdateOperationsInput | number
    impactScore?: IntFieldUpdateOperationsInput | number
    controversyScore?: IntFieldUpdateOperationsInput | number
    publishedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    discoveredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    aiSummary?: NullableStringFieldUpdateOperationsInput | string | null
    topicTags?: NewsItemUpdatetopicTagsInput | string[]
    trends?: TrendUpdateManyWithoutNewsItemsNestedInput
  }

  export type NewsItemUncheckedUpdateWithoutRelatedPostsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    url?: StringFieldUpdateOperationsInput | string
    sourceName?: StringFieldUpdateOperationsInput | string
    sourceUrl?: StringFieldUpdateOperationsInput | string
    author?: NullableStringFieldUpdateOperationsInput | string | null
    category?: EnumNewsCategoryFieldUpdateOperationsInput | $Enums.NewsCategory
    topics?: NewsItemUpdatetopicsInput | string[]
    keywords?: NewsItemUpdatekeywordsInput | string[]
    entities?: NewsItemUpdateentitiesInput | string[]
    country?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    language?: StringFieldUpdateOperationsInput | string
    sentimentScore?: FloatFieldUpdateOperationsInput | number
    impactScore?: IntFieldUpdateOperationsInput | number
    controversyScore?: IntFieldUpdateOperationsInput | number
    publishedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    discoveredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    aiSummary?: NullableStringFieldUpdateOperationsInput | string | null
    topicTags?: NewsItemUpdatetopicTagsInput | string[]
    trends?: TrendUncheckedUpdateManyWithoutNewsItemsNestedInput
  }

  export type PostUpsertWithWhereUniqueWithoutParentPostInput = {
    where: PostWhereUniqueInput
    update: XOR<PostUpdateWithoutParentPostInput, PostUncheckedUpdateWithoutParentPostInput>
    create: XOR<PostCreateWithoutParentPostInput, PostUncheckedCreateWithoutParentPostInput>
  }

  export type PostUpdateWithWhereUniqueWithoutParentPostInput = {
    where: PostWhereUniqueInput
    data: XOR<PostUpdateWithoutParentPostInput, PostUncheckedUpdateWithoutParentPostInput>
  }

  export type PostUpdateManyWithWhereWithoutParentPostInput = {
    where: PostScalarWhereInput
    data: XOR<PostUpdateManyMutationInput, PostUncheckedUpdateManyWithoutParentPostInput>
  }

  export type PostUpsertWithWhereUniqueWithoutRepostOfInput = {
    where: PostWhereUniqueInput
    update: XOR<PostUpdateWithoutRepostOfInput, PostUncheckedUpdateWithoutRepostOfInput>
    create: XOR<PostCreateWithoutRepostOfInput, PostUncheckedCreateWithoutRepostOfInput>
  }

  export type PostUpdateWithWhereUniqueWithoutRepostOfInput = {
    where: PostWhereUniqueInput
    data: XOR<PostUpdateWithoutRepostOfInput, PostUncheckedUpdateWithoutRepostOfInput>
  }

  export type PostUpdateManyWithWhereWithoutRepostOfInput = {
    where: PostScalarWhereInput
    data: XOR<PostUpdateManyMutationInput, PostUncheckedUpdateManyWithoutRepostOfInput>
  }

  export type ReactionUpsertWithWhereUniqueWithoutPostInput = {
    where: ReactionWhereUniqueInput
    update: XOR<ReactionUpdateWithoutPostInput, ReactionUncheckedUpdateWithoutPostInput>
    create: XOR<ReactionCreateWithoutPostInput, ReactionUncheckedCreateWithoutPostInput>
  }

  export type ReactionUpdateWithWhereUniqueWithoutPostInput = {
    where: ReactionWhereUniqueInput
    data: XOR<ReactionUpdateWithoutPostInput, ReactionUncheckedUpdateWithoutPostInput>
  }

  export type ReactionUpdateManyWithWhereWithoutPostInput = {
    where: ReactionScalarWhereInput
    data: XOR<ReactionUpdateManyMutationInput, ReactionUncheckedUpdateManyWithoutPostInput>
  }

  export type PostCreateWithoutThreadInput = {
    id?: string
    content: string
    mediaUrls?: PostCreatemediaUrlsInput | string[]
    linkPreview?: NullableJsonNullValueInput | InputJsonValue
    isAIGenerated?: boolean
    hashtags?: PostCreatehashtagsInput | string[]
    mentions?: PostCreatementionsInput | string[]
    newsContext?: string | null
    likeCount?: number
    repostCount?: number
    commentCount?: number
    impressionCount?: number
    contentWarning?: string | null
    isHidden?: boolean
    reportCount?: number
    publishedAt?: Date | string
    editedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    author: UserAccountCreateNestedOneWithoutPostsInput
    persona?: PersonaCreateNestedOneWithoutPostsInput
    parentPost?: PostCreateNestedOneWithoutRepliesInput
    repostOf?: PostCreateNestedOneWithoutRepostsInput
    newsItem?: NewsItemCreateNestedOneWithoutRelatedPostsInput
    replies?: PostCreateNestedManyWithoutParentPostInput
    reposts?: PostCreateNestedManyWithoutRepostOfInput
    reactions?: ReactionCreateNestedManyWithoutPostInput
  }

  export type PostUncheckedCreateWithoutThreadInput = {
    id?: string
    authorId: string
    personaId?: string | null
    content: string
    mediaUrls?: PostCreatemediaUrlsInput | string[]
    linkPreview?: NullableJsonNullValueInput | InputJsonValue
    parentPostId?: string | null
    repostOfId?: string | null
    isAIGenerated?: boolean
    hashtags?: PostCreatehashtagsInput | string[]
    mentions?: PostCreatementionsInput | string[]
    newsItemId?: string | null
    newsContext?: string | null
    likeCount?: number
    repostCount?: number
    commentCount?: number
    impressionCount?: number
    contentWarning?: string | null
    isHidden?: boolean
    reportCount?: number
    publishedAt?: Date | string
    editedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    replies?: PostUncheckedCreateNestedManyWithoutParentPostInput
    reposts?: PostUncheckedCreateNestedManyWithoutRepostOfInput
    reactions?: ReactionUncheckedCreateNestedManyWithoutPostInput
  }

  export type PostCreateOrConnectWithoutThreadInput = {
    where: PostWhereUniqueInput
    create: XOR<PostCreateWithoutThreadInput, PostUncheckedCreateWithoutThreadInput>
  }

  export type PostCreateManyThreadInputEnvelope = {
    data: PostCreateManyThreadInput | PostCreateManyThreadInput[]
    skipDuplicates?: boolean
  }

  export type PostUpsertWithWhereUniqueWithoutThreadInput = {
    where: PostWhereUniqueInput
    update: XOR<PostUpdateWithoutThreadInput, PostUncheckedUpdateWithoutThreadInput>
    create: XOR<PostCreateWithoutThreadInput, PostUncheckedCreateWithoutThreadInput>
  }

  export type PostUpdateWithWhereUniqueWithoutThreadInput = {
    where: PostWhereUniqueInput
    data: XOR<PostUpdateWithoutThreadInput, PostUncheckedUpdateWithoutThreadInput>
  }

  export type PostUpdateManyWithWhereWithoutThreadInput = {
    where: PostScalarWhereInput
    data: XOR<PostUpdateManyMutationInput, PostUncheckedUpdateManyWithoutThreadInput>
  }

  export type UserAccountCreateWithoutReactionsInput = {
    id?: string
    username: string
    email: string
    passwordHash: string
    emailVerified?: boolean
    isActive?: boolean
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    profile?: UserProfileCreateNestedOneWithoutUserInput
    politicalAlignment?: PoliticalAlignmentCreateNestedOneWithoutUserInput
    influenceMetrics?: InfluenceMetricsCreateNestedOneWithoutUserInput
    settings?: SettingsCreateNestedOneWithoutUserInput
    posts?: PostCreateNestedManyWithoutAuthorInput
  }

  export type UserAccountUncheckedCreateWithoutReactionsInput = {
    id?: string
    username: string
    email: string
    passwordHash: string
    emailVerified?: boolean
    isActive?: boolean
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    profile?: UserProfileUncheckedCreateNestedOneWithoutUserInput
    politicalAlignment?: PoliticalAlignmentUncheckedCreateNestedOneWithoutUserInput
    influenceMetrics?: InfluenceMetricsUncheckedCreateNestedOneWithoutUserInput
    settings?: SettingsUncheckedCreateNestedOneWithoutUserInput
    posts?: PostUncheckedCreateNestedManyWithoutAuthorInput
  }

  export type UserAccountCreateOrConnectWithoutReactionsInput = {
    where: UserAccountWhereUniqueInput
    create: XOR<UserAccountCreateWithoutReactionsInput, UserAccountUncheckedCreateWithoutReactionsInput>
  }

  export type PostCreateWithoutReactionsInput = {
    id?: string
    content: string
    mediaUrls?: PostCreatemediaUrlsInput | string[]
    linkPreview?: NullableJsonNullValueInput | InputJsonValue
    isAIGenerated?: boolean
    hashtags?: PostCreatehashtagsInput | string[]
    mentions?: PostCreatementionsInput | string[]
    newsContext?: string | null
    likeCount?: number
    repostCount?: number
    commentCount?: number
    impressionCount?: number
    contentWarning?: string | null
    isHidden?: boolean
    reportCount?: number
    publishedAt?: Date | string
    editedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    author: UserAccountCreateNestedOneWithoutPostsInput
    persona?: PersonaCreateNestedOneWithoutPostsInput
    thread: ThreadCreateNestedOneWithoutPostsInput
    parentPost?: PostCreateNestedOneWithoutRepliesInput
    repostOf?: PostCreateNestedOneWithoutRepostsInput
    newsItem?: NewsItemCreateNestedOneWithoutRelatedPostsInput
    replies?: PostCreateNestedManyWithoutParentPostInput
    reposts?: PostCreateNestedManyWithoutRepostOfInput
  }

  export type PostUncheckedCreateWithoutReactionsInput = {
    id?: string
    authorId: string
    personaId?: string | null
    content: string
    mediaUrls?: PostCreatemediaUrlsInput | string[]
    linkPreview?: NullableJsonNullValueInput | InputJsonValue
    threadId: string
    parentPostId?: string | null
    repostOfId?: string | null
    isAIGenerated?: boolean
    hashtags?: PostCreatehashtagsInput | string[]
    mentions?: PostCreatementionsInput | string[]
    newsItemId?: string | null
    newsContext?: string | null
    likeCount?: number
    repostCount?: number
    commentCount?: number
    impressionCount?: number
    contentWarning?: string | null
    isHidden?: boolean
    reportCount?: number
    publishedAt?: Date | string
    editedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    replies?: PostUncheckedCreateNestedManyWithoutParentPostInput
    reposts?: PostUncheckedCreateNestedManyWithoutRepostOfInput
  }

  export type PostCreateOrConnectWithoutReactionsInput = {
    where: PostWhereUniqueInput
    create: XOR<PostCreateWithoutReactionsInput, PostUncheckedCreateWithoutReactionsInput>
  }

  export type UserAccountUpsertWithoutReactionsInput = {
    update: XOR<UserAccountUpdateWithoutReactionsInput, UserAccountUncheckedUpdateWithoutReactionsInput>
    create: XOR<UserAccountCreateWithoutReactionsInput, UserAccountUncheckedCreateWithoutReactionsInput>
    where?: UserAccountWhereInput
  }

  export type UserAccountUpdateToOneWithWhereWithoutReactionsInput = {
    where?: UserAccountWhereInput
    data: XOR<UserAccountUpdateWithoutReactionsInput, UserAccountUncheckedUpdateWithoutReactionsInput>
  }

  export type UserAccountUpdateWithoutReactionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: UserProfileUpdateOneWithoutUserNestedInput
    politicalAlignment?: PoliticalAlignmentUpdateOneWithoutUserNestedInput
    influenceMetrics?: InfluenceMetricsUpdateOneWithoutUserNestedInput
    settings?: SettingsUpdateOneWithoutUserNestedInput
    posts?: PostUpdateManyWithoutAuthorNestedInput
  }

  export type UserAccountUncheckedUpdateWithoutReactionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: UserProfileUncheckedUpdateOneWithoutUserNestedInput
    politicalAlignment?: PoliticalAlignmentUncheckedUpdateOneWithoutUserNestedInput
    influenceMetrics?: InfluenceMetricsUncheckedUpdateOneWithoutUserNestedInput
    settings?: SettingsUncheckedUpdateOneWithoutUserNestedInput
    posts?: PostUncheckedUpdateManyWithoutAuthorNestedInput
  }

  export type PostUpsertWithoutReactionsInput = {
    update: XOR<PostUpdateWithoutReactionsInput, PostUncheckedUpdateWithoutReactionsInput>
    create: XOR<PostCreateWithoutReactionsInput, PostUncheckedCreateWithoutReactionsInput>
    where?: PostWhereInput
  }

  export type PostUpdateToOneWithWhereWithoutReactionsInput = {
    where?: PostWhereInput
    data: XOR<PostUpdateWithoutReactionsInput, PostUncheckedUpdateWithoutReactionsInput>
  }

  export type PostUpdateWithoutReactionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    mediaUrls?: PostUpdatemediaUrlsInput | string[]
    linkPreview?: NullableJsonNullValueInput | InputJsonValue
    isAIGenerated?: BoolFieldUpdateOperationsInput | boolean
    hashtags?: PostUpdatehashtagsInput | string[]
    mentions?: PostUpdatementionsInput | string[]
    newsContext?: NullableStringFieldUpdateOperationsInput | string | null
    likeCount?: IntFieldUpdateOperationsInput | number
    repostCount?: IntFieldUpdateOperationsInput | number
    commentCount?: IntFieldUpdateOperationsInput | number
    impressionCount?: IntFieldUpdateOperationsInput | number
    contentWarning?: NullableStringFieldUpdateOperationsInput | string | null
    isHidden?: BoolFieldUpdateOperationsInput | boolean
    reportCount?: IntFieldUpdateOperationsInput | number
    publishedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    editedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    author?: UserAccountUpdateOneRequiredWithoutPostsNestedInput
    persona?: PersonaUpdateOneWithoutPostsNestedInput
    thread?: ThreadUpdateOneRequiredWithoutPostsNestedInput
    parentPost?: PostUpdateOneWithoutRepliesNestedInput
    repostOf?: PostUpdateOneWithoutRepostsNestedInput
    newsItem?: NewsItemUpdateOneWithoutRelatedPostsNestedInput
    replies?: PostUpdateManyWithoutParentPostNestedInput
    reposts?: PostUpdateManyWithoutRepostOfNestedInput
  }

  export type PostUncheckedUpdateWithoutReactionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    personaId?: NullableStringFieldUpdateOperationsInput | string | null
    content?: StringFieldUpdateOperationsInput | string
    mediaUrls?: PostUpdatemediaUrlsInput | string[]
    linkPreview?: NullableJsonNullValueInput | InputJsonValue
    threadId?: StringFieldUpdateOperationsInput | string
    parentPostId?: NullableStringFieldUpdateOperationsInput | string | null
    repostOfId?: NullableStringFieldUpdateOperationsInput | string | null
    isAIGenerated?: BoolFieldUpdateOperationsInput | boolean
    hashtags?: PostUpdatehashtagsInput | string[]
    mentions?: PostUpdatementionsInput | string[]
    newsItemId?: NullableStringFieldUpdateOperationsInput | string | null
    newsContext?: NullableStringFieldUpdateOperationsInput | string | null
    likeCount?: IntFieldUpdateOperationsInput | number
    repostCount?: IntFieldUpdateOperationsInput | number
    commentCount?: IntFieldUpdateOperationsInput | number
    impressionCount?: IntFieldUpdateOperationsInput | number
    contentWarning?: NullableStringFieldUpdateOperationsInput | string | null
    isHidden?: BoolFieldUpdateOperationsInput | boolean
    reportCount?: IntFieldUpdateOperationsInput | number
    publishedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    editedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    replies?: PostUncheckedUpdateManyWithoutParentPostNestedInput
    reposts?: PostUncheckedUpdateManyWithoutRepostOfNestedInput
  }

  export type PoliticalAlignmentCreateWithoutPersonasInput = {
    id?: string
    economicPosition: number
    socialPosition: number
    primaryIssues?: PoliticalAlignmentCreateprimaryIssuesInput | string[]
    partyAffiliation?: string | null
    ideologyTags?: PoliticalAlignmentCreateideologyTagsInput | string[]
    debateWillingness: number
    controversyTolerance: number
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserAccountCreateNestedOneWithoutPoliticalAlignmentInput
  }

  export type PoliticalAlignmentUncheckedCreateWithoutPersonasInput = {
    id?: string
    userId: string
    economicPosition: number
    socialPosition: number
    primaryIssues?: PoliticalAlignmentCreateprimaryIssuesInput | string[]
    partyAffiliation?: string | null
    ideologyTags?: PoliticalAlignmentCreateideologyTagsInput | string[]
    debateWillingness: number
    controversyTolerance: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PoliticalAlignmentCreateOrConnectWithoutPersonasInput = {
    where: PoliticalAlignmentWhereUniqueInput
    create: XOR<PoliticalAlignmentCreateWithoutPersonasInput, PoliticalAlignmentUncheckedCreateWithoutPersonasInput>
  }

  export type PostCreateWithoutPersonaInput = {
    id?: string
    content: string
    mediaUrls?: PostCreatemediaUrlsInput | string[]
    linkPreview?: NullableJsonNullValueInput | InputJsonValue
    isAIGenerated?: boolean
    hashtags?: PostCreatehashtagsInput | string[]
    mentions?: PostCreatementionsInput | string[]
    newsContext?: string | null
    likeCount?: number
    repostCount?: number
    commentCount?: number
    impressionCount?: number
    contentWarning?: string | null
    isHidden?: boolean
    reportCount?: number
    publishedAt?: Date | string
    editedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    author: UserAccountCreateNestedOneWithoutPostsInput
    thread: ThreadCreateNestedOneWithoutPostsInput
    parentPost?: PostCreateNestedOneWithoutRepliesInput
    repostOf?: PostCreateNestedOneWithoutRepostsInput
    newsItem?: NewsItemCreateNestedOneWithoutRelatedPostsInput
    replies?: PostCreateNestedManyWithoutParentPostInput
    reposts?: PostCreateNestedManyWithoutRepostOfInput
    reactions?: ReactionCreateNestedManyWithoutPostInput
  }

  export type PostUncheckedCreateWithoutPersonaInput = {
    id?: string
    authorId: string
    content: string
    mediaUrls?: PostCreatemediaUrlsInput | string[]
    linkPreview?: NullableJsonNullValueInput | InputJsonValue
    threadId: string
    parentPostId?: string | null
    repostOfId?: string | null
    isAIGenerated?: boolean
    hashtags?: PostCreatehashtagsInput | string[]
    mentions?: PostCreatementionsInput | string[]
    newsItemId?: string | null
    newsContext?: string | null
    likeCount?: number
    repostCount?: number
    commentCount?: number
    impressionCount?: number
    contentWarning?: string | null
    isHidden?: boolean
    reportCount?: number
    publishedAt?: Date | string
    editedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    replies?: PostUncheckedCreateNestedManyWithoutParentPostInput
    reposts?: PostUncheckedCreateNestedManyWithoutRepostOfInput
    reactions?: ReactionUncheckedCreateNestedManyWithoutPostInput
  }

  export type PostCreateOrConnectWithoutPersonaInput = {
    where: PostWhereUniqueInput
    create: XOR<PostCreateWithoutPersonaInput, PostUncheckedCreateWithoutPersonaInput>
  }

  export type PostCreateManyPersonaInputEnvelope = {
    data: PostCreateManyPersonaInput | PostCreateManyPersonaInput[]
    skipDuplicates?: boolean
  }

  export type PoliticalAlignmentUpsertWithoutPersonasInput = {
    update: XOR<PoliticalAlignmentUpdateWithoutPersonasInput, PoliticalAlignmentUncheckedUpdateWithoutPersonasInput>
    create: XOR<PoliticalAlignmentCreateWithoutPersonasInput, PoliticalAlignmentUncheckedCreateWithoutPersonasInput>
    where?: PoliticalAlignmentWhereInput
  }

  export type PoliticalAlignmentUpdateToOneWithWhereWithoutPersonasInput = {
    where?: PoliticalAlignmentWhereInput
    data: XOR<PoliticalAlignmentUpdateWithoutPersonasInput, PoliticalAlignmentUncheckedUpdateWithoutPersonasInput>
  }

  export type PoliticalAlignmentUpdateWithoutPersonasInput = {
    id?: StringFieldUpdateOperationsInput | string
    economicPosition?: IntFieldUpdateOperationsInput | number
    socialPosition?: IntFieldUpdateOperationsInput | number
    primaryIssues?: PoliticalAlignmentUpdateprimaryIssuesInput | string[]
    partyAffiliation?: NullableStringFieldUpdateOperationsInput | string | null
    ideologyTags?: PoliticalAlignmentUpdateideologyTagsInput | string[]
    debateWillingness?: IntFieldUpdateOperationsInput | number
    controversyTolerance?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserAccountUpdateOneRequiredWithoutPoliticalAlignmentNestedInput
  }

  export type PoliticalAlignmentUncheckedUpdateWithoutPersonasInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    economicPosition?: IntFieldUpdateOperationsInput | number
    socialPosition?: IntFieldUpdateOperationsInput | number
    primaryIssues?: PoliticalAlignmentUpdateprimaryIssuesInput | string[]
    partyAffiliation?: NullableStringFieldUpdateOperationsInput | string | null
    ideologyTags?: PoliticalAlignmentUpdateideologyTagsInput | string[]
    debateWillingness?: IntFieldUpdateOperationsInput | number
    controversyTolerance?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PostUpsertWithWhereUniqueWithoutPersonaInput = {
    where: PostWhereUniqueInput
    update: XOR<PostUpdateWithoutPersonaInput, PostUncheckedUpdateWithoutPersonaInput>
    create: XOR<PostCreateWithoutPersonaInput, PostUncheckedCreateWithoutPersonaInput>
  }

  export type PostUpdateWithWhereUniqueWithoutPersonaInput = {
    where: PostWhereUniqueInput
    data: XOR<PostUpdateWithoutPersonaInput, PostUncheckedUpdateWithoutPersonaInput>
  }

  export type PostUpdateManyWithWhereWithoutPersonaInput = {
    where: PostScalarWhereInput
    data: XOR<PostUpdateManyMutationInput, PostUncheckedUpdateManyWithoutPersonaInput>
  }

  export type TrendCreateWithoutNewsItemsInput = {
    id?: string
    hashtag?: string | null
    keyword?: string | null
    topic: string
    postCount?: number
    uniqueUsers?: number
    impressionCount?: number
    engagementCount?: number
    trendScore?: number
    velocity?: number
    peakTime?: Date | string | null
    category?: $Enums.TrendCategory
    region?: string | null
    language?: string
    isPromoted?: boolean
    isHidden?: boolean
    startedAt?: Date | string
    endedAt?: Date | string | null
    lastUpdated?: Date | string
    createdAt?: Date | string
  }

  export type TrendUncheckedCreateWithoutNewsItemsInput = {
    id?: string
    hashtag?: string | null
    keyword?: string | null
    topic: string
    postCount?: number
    uniqueUsers?: number
    impressionCount?: number
    engagementCount?: number
    trendScore?: number
    velocity?: number
    peakTime?: Date | string | null
    category?: $Enums.TrendCategory
    region?: string | null
    language?: string
    isPromoted?: boolean
    isHidden?: boolean
    startedAt?: Date | string
    endedAt?: Date | string | null
    lastUpdated?: Date | string
    createdAt?: Date | string
  }

  export type TrendCreateOrConnectWithoutNewsItemsInput = {
    where: TrendWhereUniqueInput
    create: XOR<TrendCreateWithoutNewsItemsInput, TrendUncheckedCreateWithoutNewsItemsInput>
  }

  export type PostCreateWithoutNewsItemInput = {
    id?: string
    content: string
    mediaUrls?: PostCreatemediaUrlsInput | string[]
    linkPreview?: NullableJsonNullValueInput | InputJsonValue
    isAIGenerated?: boolean
    hashtags?: PostCreatehashtagsInput | string[]
    mentions?: PostCreatementionsInput | string[]
    newsContext?: string | null
    likeCount?: number
    repostCount?: number
    commentCount?: number
    impressionCount?: number
    contentWarning?: string | null
    isHidden?: boolean
    reportCount?: number
    publishedAt?: Date | string
    editedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    author: UserAccountCreateNestedOneWithoutPostsInput
    persona?: PersonaCreateNestedOneWithoutPostsInput
    thread: ThreadCreateNestedOneWithoutPostsInput
    parentPost?: PostCreateNestedOneWithoutRepliesInput
    repostOf?: PostCreateNestedOneWithoutRepostsInput
    replies?: PostCreateNestedManyWithoutParentPostInput
    reposts?: PostCreateNestedManyWithoutRepostOfInput
    reactions?: ReactionCreateNestedManyWithoutPostInput
  }

  export type PostUncheckedCreateWithoutNewsItemInput = {
    id?: string
    authorId: string
    personaId?: string | null
    content: string
    mediaUrls?: PostCreatemediaUrlsInput | string[]
    linkPreview?: NullableJsonNullValueInput | InputJsonValue
    threadId: string
    parentPostId?: string | null
    repostOfId?: string | null
    isAIGenerated?: boolean
    hashtags?: PostCreatehashtagsInput | string[]
    mentions?: PostCreatementionsInput | string[]
    newsContext?: string | null
    likeCount?: number
    repostCount?: number
    commentCount?: number
    impressionCount?: number
    contentWarning?: string | null
    isHidden?: boolean
    reportCount?: number
    publishedAt?: Date | string
    editedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    replies?: PostUncheckedCreateNestedManyWithoutParentPostInput
    reposts?: PostUncheckedCreateNestedManyWithoutRepostOfInput
    reactions?: ReactionUncheckedCreateNestedManyWithoutPostInput
  }

  export type PostCreateOrConnectWithoutNewsItemInput = {
    where: PostWhereUniqueInput
    create: XOR<PostCreateWithoutNewsItemInput, PostUncheckedCreateWithoutNewsItemInput>
  }

  export type PostCreateManyNewsItemInputEnvelope = {
    data: PostCreateManyNewsItemInput | PostCreateManyNewsItemInput[]
    skipDuplicates?: boolean
  }

  export type TrendUpsertWithWhereUniqueWithoutNewsItemsInput = {
    where: TrendWhereUniqueInput
    update: XOR<TrendUpdateWithoutNewsItemsInput, TrendUncheckedUpdateWithoutNewsItemsInput>
    create: XOR<TrendCreateWithoutNewsItemsInput, TrendUncheckedCreateWithoutNewsItemsInput>
  }

  export type TrendUpdateWithWhereUniqueWithoutNewsItemsInput = {
    where: TrendWhereUniqueInput
    data: XOR<TrendUpdateWithoutNewsItemsInput, TrendUncheckedUpdateWithoutNewsItemsInput>
  }

  export type TrendUpdateManyWithWhereWithoutNewsItemsInput = {
    where: TrendScalarWhereInput
    data: XOR<TrendUpdateManyMutationInput, TrendUncheckedUpdateManyWithoutNewsItemsInput>
  }

  export type TrendScalarWhereInput = {
    AND?: TrendScalarWhereInput | TrendScalarWhereInput[]
    OR?: TrendScalarWhereInput[]
    NOT?: TrendScalarWhereInput | TrendScalarWhereInput[]
    id?: StringFilter<"Trend"> | string
    hashtag?: StringNullableFilter<"Trend"> | string | null
    keyword?: StringNullableFilter<"Trend"> | string | null
    topic?: StringFilter<"Trend"> | string
    postCount?: IntFilter<"Trend"> | number
    uniqueUsers?: IntFilter<"Trend"> | number
    impressionCount?: IntFilter<"Trend"> | number
    engagementCount?: IntFilter<"Trend"> | number
    trendScore?: IntFilter<"Trend"> | number
    velocity?: FloatFilter<"Trend"> | number
    peakTime?: DateTimeNullableFilter<"Trend"> | Date | string | null
    category?: EnumTrendCategoryFilter<"Trend"> | $Enums.TrendCategory
    region?: StringNullableFilter<"Trend"> | string | null
    language?: StringFilter<"Trend"> | string
    isPromoted?: BoolFilter<"Trend"> | boolean
    isHidden?: BoolFilter<"Trend"> | boolean
    startedAt?: DateTimeFilter<"Trend"> | Date | string
    endedAt?: DateTimeNullableFilter<"Trend"> | Date | string | null
    lastUpdated?: DateTimeFilter<"Trend"> | Date | string
    createdAt?: DateTimeFilter<"Trend"> | Date | string
  }

  export type PostUpsertWithWhereUniqueWithoutNewsItemInput = {
    where: PostWhereUniqueInput
    update: XOR<PostUpdateWithoutNewsItemInput, PostUncheckedUpdateWithoutNewsItemInput>
    create: XOR<PostCreateWithoutNewsItemInput, PostUncheckedCreateWithoutNewsItemInput>
  }

  export type PostUpdateWithWhereUniqueWithoutNewsItemInput = {
    where: PostWhereUniqueInput
    data: XOR<PostUpdateWithoutNewsItemInput, PostUncheckedUpdateWithoutNewsItemInput>
  }

  export type PostUpdateManyWithWhereWithoutNewsItemInput = {
    where: PostScalarWhereInput
    data: XOR<PostUpdateManyMutationInput, PostUncheckedUpdateManyWithoutNewsItemInput>
  }

  export type NewsItemCreateWithoutTrendsInput = {
    id?: string
    title: string
    description: string
    content?: string | null
    url: string
    sourceName: string
    sourceUrl: string
    author?: string | null
    category?: $Enums.NewsCategory
    topics?: NewsItemCreatetopicsInput | string[]
    keywords?: NewsItemCreatekeywordsInput | string[]
    entities?: NewsItemCreateentitiesInput | string[]
    country?: string | null
    region?: string | null
    language?: string
    sentimentScore?: number
    impactScore?: number
    controversyScore?: number
    publishedAt: Date | string
    discoveredAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    aiSummary?: string | null
    topicTags?: NewsItemCreatetopicTagsInput | string[]
    relatedPosts?: PostCreateNestedManyWithoutNewsItemInput
  }

  export type NewsItemUncheckedCreateWithoutTrendsInput = {
    id?: string
    title: string
    description: string
    content?: string | null
    url: string
    sourceName: string
    sourceUrl: string
    author?: string | null
    category?: $Enums.NewsCategory
    topics?: NewsItemCreatetopicsInput | string[]
    keywords?: NewsItemCreatekeywordsInput | string[]
    entities?: NewsItemCreateentitiesInput | string[]
    country?: string | null
    region?: string | null
    language?: string
    sentimentScore?: number
    impactScore?: number
    controversyScore?: number
    publishedAt: Date | string
    discoveredAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    aiSummary?: string | null
    topicTags?: NewsItemCreatetopicTagsInput | string[]
    relatedPosts?: PostUncheckedCreateNestedManyWithoutNewsItemInput
  }

  export type NewsItemCreateOrConnectWithoutTrendsInput = {
    where: NewsItemWhereUniqueInput
    create: XOR<NewsItemCreateWithoutTrendsInput, NewsItemUncheckedCreateWithoutTrendsInput>
  }

  export type NewsItemUpsertWithWhereUniqueWithoutTrendsInput = {
    where: NewsItemWhereUniqueInput
    update: XOR<NewsItemUpdateWithoutTrendsInput, NewsItemUncheckedUpdateWithoutTrendsInput>
    create: XOR<NewsItemCreateWithoutTrendsInput, NewsItemUncheckedCreateWithoutTrendsInput>
  }

  export type NewsItemUpdateWithWhereUniqueWithoutTrendsInput = {
    where: NewsItemWhereUniqueInput
    data: XOR<NewsItemUpdateWithoutTrendsInput, NewsItemUncheckedUpdateWithoutTrendsInput>
  }

  export type NewsItemUpdateManyWithWhereWithoutTrendsInput = {
    where: NewsItemScalarWhereInput
    data: XOR<NewsItemUpdateManyMutationInput, NewsItemUncheckedUpdateManyWithoutTrendsInput>
  }

  export type NewsItemScalarWhereInput = {
    AND?: NewsItemScalarWhereInput | NewsItemScalarWhereInput[]
    OR?: NewsItemScalarWhereInput[]
    NOT?: NewsItemScalarWhereInput | NewsItemScalarWhereInput[]
    id?: StringFilter<"NewsItem"> | string
    title?: StringFilter<"NewsItem"> | string
    description?: StringFilter<"NewsItem"> | string
    content?: StringNullableFilter<"NewsItem"> | string | null
    url?: StringFilter<"NewsItem"> | string
    sourceName?: StringFilter<"NewsItem"> | string
    sourceUrl?: StringFilter<"NewsItem"> | string
    author?: StringNullableFilter<"NewsItem"> | string | null
    category?: EnumNewsCategoryFilter<"NewsItem"> | $Enums.NewsCategory
    topics?: StringNullableListFilter<"NewsItem">
    keywords?: StringNullableListFilter<"NewsItem">
    entities?: StringNullableListFilter<"NewsItem">
    country?: StringNullableFilter<"NewsItem"> | string | null
    region?: StringNullableFilter<"NewsItem"> | string | null
    language?: StringFilter<"NewsItem"> | string
    sentimentScore?: FloatFilter<"NewsItem"> | number
    impactScore?: IntFilter<"NewsItem"> | number
    controversyScore?: IntFilter<"NewsItem"> | number
    publishedAt?: DateTimeFilter<"NewsItem"> | Date | string
    discoveredAt?: DateTimeFilter<"NewsItem"> | Date | string
    createdAt?: DateTimeFilter<"NewsItem"> | Date | string
    updatedAt?: DateTimeFilter<"NewsItem"> | Date | string
    aiSummary?: StringNullableFilter<"NewsItem"> | string | null
    topicTags?: StringNullableListFilter<"NewsItem">
  }

  export type PostCreateManyAuthorInput = {
    id?: string
    personaId?: string | null
    content: string
    mediaUrls?: PostCreatemediaUrlsInput | string[]
    linkPreview?: NullableJsonNullValueInput | InputJsonValue
    threadId: string
    parentPostId?: string | null
    repostOfId?: string | null
    isAIGenerated?: boolean
    hashtags?: PostCreatehashtagsInput | string[]
    mentions?: PostCreatementionsInput | string[]
    newsItemId?: string | null
    newsContext?: string | null
    likeCount?: number
    repostCount?: number
    commentCount?: number
    impressionCount?: number
    contentWarning?: string | null
    isHidden?: boolean
    reportCount?: number
    publishedAt?: Date | string
    editedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReactionCreateManyUserInput = {
    id?: string
    postId: string
    type: $Enums.ReactionType
    createdAt?: Date | string
  }

  export type PostUpdateWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    mediaUrls?: PostUpdatemediaUrlsInput | string[]
    linkPreview?: NullableJsonNullValueInput | InputJsonValue
    isAIGenerated?: BoolFieldUpdateOperationsInput | boolean
    hashtags?: PostUpdatehashtagsInput | string[]
    mentions?: PostUpdatementionsInput | string[]
    newsContext?: NullableStringFieldUpdateOperationsInput | string | null
    likeCount?: IntFieldUpdateOperationsInput | number
    repostCount?: IntFieldUpdateOperationsInput | number
    commentCount?: IntFieldUpdateOperationsInput | number
    impressionCount?: IntFieldUpdateOperationsInput | number
    contentWarning?: NullableStringFieldUpdateOperationsInput | string | null
    isHidden?: BoolFieldUpdateOperationsInput | boolean
    reportCount?: IntFieldUpdateOperationsInput | number
    publishedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    editedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    persona?: PersonaUpdateOneWithoutPostsNestedInput
    thread?: ThreadUpdateOneRequiredWithoutPostsNestedInput
    parentPost?: PostUpdateOneWithoutRepliesNestedInput
    repostOf?: PostUpdateOneWithoutRepostsNestedInput
    newsItem?: NewsItemUpdateOneWithoutRelatedPostsNestedInput
    replies?: PostUpdateManyWithoutParentPostNestedInput
    reposts?: PostUpdateManyWithoutRepostOfNestedInput
    reactions?: ReactionUpdateManyWithoutPostNestedInput
  }

  export type PostUncheckedUpdateWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string
    personaId?: NullableStringFieldUpdateOperationsInput | string | null
    content?: StringFieldUpdateOperationsInput | string
    mediaUrls?: PostUpdatemediaUrlsInput | string[]
    linkPreview?: NullableJsonNullValueInput | InputJsonValue
    threadId?: StringFieldUpdateOperationsInput | string
    parentPostId?: NullableStringFieldUpdateOperationsInput | string | null
    repostOfId?: NullableStringFieldUpdateOperationsInput | string | null
    isAIGenerated?: BoolFieldUpdateOperationsInput | boolean
    hashtags?: PostUpdatehashtagsInput | string[]
    mentions?: PostUpdatementionsInput | string[]
    newsItemId?: NullableStringFieldUpdateOperationsInput | string | null
    newsContext?: NullableStringFieldUpdateOperationsInput | string | null
    likeCount?: IntFieldUpdateOperationsInput | number
    repostCount?: IntFieldUpdateOperationsInput | number
    commentCount?: IntFieldUpdateOperationsInput | number
    impressionCount?: IntFieldUpdateOperationsInput | number
    contentWarning?: NullableStringFieldUpdateOperationsInput | string | null
    isHidden?: BoolFieldUpdateOperationsInput | boolean
    reportCount?: IntFieldUpdateOperationsInput | number
    publishedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    editedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    replies?: PostUncheckedUpdateManyWithoutParentPostNestedInput
    reposts?: PostUncheckedUpdateManyWithoutRepostOfNestedInput
    reactions?: ReactionUncheckedUpdateManyWithoutPostNestedInput
  }

  export type PostUncheckedUpdateManyWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string
    personaId?: NullableStringFieldUpdateOperationsInput | string | null
    content?: StringFieldUpdateOperationsInput | string
    mediaUrls?: PostUpdatemediaUrlsInput | string[]
    linkPreview?: NullableJsonNullValueInput | InputJsonValue
    threadId?: StringFieldUpdateOperationsInput | string
    parentPostId?: NullableStringFieldUpdateOperationsInput | string | null
    repostOfId?: NullableStringFieldUpdateOperationsInput | string | null
    isAIGenerated?: BoolFieldUpdateOperationsInput | boolean
    hashtags?: PostUpdatehashtagsInput | string[]
    mentions?: PostUpdatementionsInput | string[]
    newsItemId?: NullableStringFieldUpdateOperationsInput | string | null
    newsContext?: NullableStringFieldUpdateOperationsInput | string | null
    likeCount?: IntFieldUpdateOperationsInput | number
    repostCount?: IntFieldUpdateOperationsInput | number
    commentCount?: IntFieldUpdateOperationsInput | number
    impressionCount?: IntFieldUpdateOperationsInput | number
    contentWarning?: NullableStringFieldUpdateOperationsInput | string | null
    isHidden?: BoolFieldUpdateOperationsInput | boolean
    reportCount?: IntFieldUpdateOperationsInput | number
    publishedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    editedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReactionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumReactionTypeFieldUpdateOperationsInput | $Enums.ReactionType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    post?: PostUpdateOneRequiredWithoutReactionsNestedInput
  }

  export type ReactionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    postId?: StringFieldUpdateOperationsInput | string
    type?: EnumReactionTypeFieldUpdateOperationsInput | $Enums.ReactionType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReactionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    postId?: StringFieldUpdateOperationsInput | string
    type?: EnumReactionTypeFieldUpdateOperationsInput | $Enums.ReactionType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PersonaCreateManyPoliticalAlignmentInput = {
    id?: string
    name: string
    handle: string
    bio: string
    profileImageUrl: string
    personaType: $Enums.PersonaType
    personalityTraits?: PersonaCreatepersonalityTraitsInput | string[]
    interests?: PersonaCreateinterestsInput | string[]
    expertise?: PersonaCreateexpertiseInput | string[]
    toneStyle?: $Enums.ToneStyle
    controversyTolerance?: number
    engagementFrequency?: number
    debateAggression?: number
    aiProvider?: string
    systemPrompt: string
    contextWindow?: number
    postingSchedule: JsonNullValueInput | InputJsonValue
    timezonePreference?: string
    isActive?: boolean
    isDefault?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PersonaUpdateWithoutPoliticalAlignmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    handle?: StringFieldUpdateOperationsInput | string
    bio?: StringFieldUpdateOperationsInput | string
    profileImageUrl?: StringFieldUpdateOperationsInput | string
    personaType?: EnumPersonaTypeFieldUpdateOperationsInput | $Enums.PersonaType
    personalityTraits?: PersonaUpdatepersonalityTraitsInput | string[]
    interests?: PersonaUpdateinterestsInput | string[]
    expertise?: PersonaUpdateexpertiseInput | string[]
    toneStyle?: EnumToneStyleFieldUpdateOperationsInput | $Enums.ToneStyle
    controversyTolerance?: IntFieldUpdateOperationsInput | number
    engagementFrequency?: IntFieldUpdateOperationsInput | number
    debateAggression?: IntFieldUpdateOperationsInput | number
    aiProvider?: StringFieldUpdateOperationsInput | string
    systemPrompt?: StringFieldUpdateOperationsInput | string
    contextWindow?: IntFieldUpdateOperationsInput | number
    postingSchedule?: JsonNullValueInput | InputJsonValue
    timezonePreference?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    posts?: PostUpdateManyWithoutPersonaNestedInput
  }

  export type PersonaUncheckedUpdateWithoutPoliticalAlignmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    handle?: StringFieldUpdateOperationsInput | string
    bio?: StringFieldUpdateOperationsInput | string
    profileImageUrl?: StringFieldUpdateOperationsInput | string
    personaType?: EnumPersonaTypeFieldUpdateOperationsInput | $Enums.PersonaType
    personalityTraits?: PersonaUpdatepersonalityTraitsInput | string[]
    interests?: PersonaUpdateinterestsInput | string[]
    expertise?: PersonaUpdateexpertiseInput | string[]
    toneStyle?: EnumToneStyleFieldUpdateOperationsInput | $Enums.ToneStyle
    controversyTolerance?: IntFieldUpdateOperationsInput | number
    engagementFrequency?: IntFieldUpdateOperationsInput | number
    debateAggression?: IntFieldUpdateOperationsInput | number
    aiProvider?: StringFieldUpdateOperationsInput | string
    systemPrompt?: StringFieldUpdateOperationsInput | string
    contextWindow?: IntFieldUpdateOperationsInput | number
    postingSchedule?: JsonNullValueInput | InputJsonValue
    timezonePreference?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    posts?: PostUncheckedUpdateManyWithoutPersonaNestedInput
  }

  export type PersonaUncheckedUpdateManyWithoutPoliticalAlignmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    handle?: StringFieldUpdateOperationsInput | string
    bio?: StringFieldUpdateOperationsInput | string
    profileImageUrl?: StringFieldUpdateOperationsInput | string
    personaType?: EnumPersonaTypeFieldUpdateOperationsInput | $Enums.PersonaType
    personalityTraits?: PersonaUpdatepersonalityTraitsInput | string[]
    interests?: PersonaUpdateinterestsInput | string[]
    expertise?: PersonaUpdateexpertiseInput | string[]
    toneStyle?: EnumToneStyleFieldUpdateOperationsInput | $Enums.ToneStyle
    controversyTolerance?: IntFieldUpdateOperationsInput | number
    engagementFrequency?: IntFieldUpdateOperationsInput | number
    debateAggression?: IntFieldUpdateOperationsInput | number
    aiProvider?: StringFieldUpdateOperationsInput | string
    systemPrompt?: StringFieldUpdateOperationsInput | string
    contextWindow?: IntFieldUpdateOperationsInput | number
    postingSchedule?: JsonNullValueInput | InputJsonValue
    timezonePreference?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PostCreateManyParentPostInput = {
    id?: string
    authorId: string
    personaId?: string | null
    content: string
    mediaUrls?: PostCreatemediaUrlsInput | string[]
    linkPreview?: NullableJsonNullValueInput | InputJsonValue
    threadId: string
    repostOfId?: string | null
    isAIGenerated?: boolean
    hashtags?: PostCreatehashtagsInput | string[]
    mentions?: PostCreatementionsInput | string[]
    newsItemId?: string | null
    newsContext?: string | null
    likeCount?: number
    repostCount?: number
    commentCount?: number
    impressionCount?: number
    contentWarning?: string | null
    isHidden?: boolean
    reportCount?: number
    publishedAt?: Date | string
    editedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PostCreateManyRepostOfInput = {
    id?: string
    authorId: string
    personaId?: string | null
    content: string
    mediaUrls?: PostCreatemediaUrlsInput | string[]
    linkPreview?: NullableJsonNullValueInput | InputJsonValue
    threadId: string
    parentPostId?: string | null
    isAIGenerated?: boolean
    hashtags?: PostCreatehashtagsInput | string[]
    mentions?: PostCreatementionsInput | string[]
    newsItemId?: string | null
    newsContext?: string | null
    likeCount?: number
    repostCount?: number
    commentCount?: number
    impressionCount?: number
    contentWarning?: string | null
    isHidden?: boolean
    reportCount?: number
    publishedAt?: Date | string
    editedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReactionCreateManyPostInput = {
    id?: string
    userId: string
    type: $Enums.ReactionType
    createdAt?: Date | string
  }

  export type PostUpdateWithoutParentPostInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    mediaUrls?: PostUpdatemediaUrlsInput | string[]
    linkPreview?: NullableJsonNullValueInput | InputJsonValue
    isAIGenerated?: BoolFieldUpdateOperationsInput | boolean
    hashtags?: PostUpdatehashtagsInput | string[]
    mentions?: PostUpdatementionsInput | string[]
    newsContext?: NullableStringFieldUpdateOperationsInput | string | null
    likeCount?: IntFieldUpdateOperationsInput | number
    repostCount?: IntFieldUpdateOperationsInput | number
    commentCount?: IntFieldUpdateOperationsInput | number
    impressionCount?: IntFieldUpdateOperationsInput | number
    contentWarning?: NullableStringFieldUpdateOperationsInput | string | null
    isHidden?: BoolFieldUpdateOperationsInput | boolean
    reportCount?: IntFieldUpdateOperationsInput | number
    publishedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    editedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    author?: UserAccountUpdateOneRequiredWithoutPostsNestedInput
    persona?: PersonaUpdateOneWithoutPostsNestedInput
    thread?: ThreadUpdateOneRequiredWithoutPostsNestedInput
    repostOf?: PostUpdateOneWithoutRepostsNestedInput
    newsItem?: NewsItemUpdateOneWithoutRelatedPostsNestedInput
    replies?: PostUpdateManyWithoutParentPostNestedInput
    reposts?: PostUpdateManyWithoutRepostOfNestedInput
    reactions?: ReactionUpdateManyWithoutPostNestedInput
  }

  export type PostUncheckedUpdateWithoutParentPostInput = {
    id?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    personaId?: NullableStringFieldUpdateOperationsInput | string | null
    content?: StringFieldUpdateOperationsInput | string
    mediaUrls?: PostUpdatemediaUrlsInput | string[]
    linkPreview?: NullableJsonNullValueInput | InputJsonValue
    threadId?: StringFieldUpdateOperationsInput | string
    repostOfId?: NullableStringFieldUpdateOperationsInput | string | null
    isAIGenerated?: BoolFieldUpdateOperationsInput | boolean
    hashtags?: PostUpdatehashtagsInput | string[]
    mentions?: PostUpdatementionsInput | string[]
    newsItemId?: NullableStringFieldUpdateOperationsInput | string | null
    newsContext?: NullableStringFieldUpdateOperationsInput | string | null
    likeCount?: IntFieldUpdateOperationsInput | number
    repostCount?: IntFieldUpdateOperationsInput | number
    commentCount?: IntFieldUpdateOperationsInput | number
    impressionCount?: IntFieldUpdateOperationsInput | number
    contentWarning?: NullableStringFieldUpdateOperationsInput | string | null
    isHidden?: BoolFieldUpdateOperationsInput | boolean
    reportCount?: IntFieldUpdateOperationsInput | number
    publishedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    editedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    replies?: PostUncheckedUpdateManyWithoutParentPostNestedInput
    reposts?: PostUncheckedUpdateManyWithoutRepostOfNestedInput
    reactions?: ReactionUncheckedUpdateManyWithoutPostNestedInput
  }

  export type PostUncheckedUpdateManyWithoutParentPostInput = {
    id?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    personaId?: NullableStringFieldUpdateOperationsInput | string | null
    content?: StringFieldUpdateOperationsInput | string
    mediaUrls?: PostUpdatemediaUrlsInput | string[]
    linkPreview?: NullableJsonNullValueInput | InputJsonValue
    threadId?: StringFieldUpdateOperationsInput | string
    repostOfId?: NullableStringFieldUpdateOperationsInput | string | null
    isAIGenerated?: BoolFieldUpdateOperationsInput | boolean
    hashtags?: PostUpdatehashtagsInput | string[]
    mentions?: PostUpdatementionsInput | string[]
    newsItemId?: NullableStringFieldUpdateOperationsInput | string | null
    newsContext?: NullableStringFieldUpdateOperationsInput | string | null
    likeCount?: IntFieldUpdateOperationsInput | number
    repostCount?: IntFieldUpdateOperationsInput | number
    commentCount?: IntFieldUpdateOperationsInput | number
    impressionCount?: IntFieldUpdateOperationsInput | number
    contentWarning?: NullableStringFieldUpdateOperationsInput | string | null
    isHidden?: BoolFieldUpdateOperationsInput | boolean
    reportCount?: IntFieldUpdateOperationsInput | number
    publishedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    editedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PostUpdateWithoutRepostOfInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    mediaUrls?: PostUpdatemediaUrlsInput | string[]
    linkPreview?: NullableJsonNullValueInput | InputJsonValue
    isAIGenerated?: BoolFieldUpdateOperationsInput | boolean
    hashtags?: PostUpdatehashtagsInput | string[]
    mentions?: PostUpdatementionsInput | string[]
    newsContext?: NullableStringFieldUpdateOperationsInput | string | null
    likeCount?: IntFieldUpdateOperationsInput | number
    repostCount?: IntFieldUpdateOperationsInput | number
    commentCount?: IntFieldUpdateOperationsInput | number
    impressionCount?: IntFieldUpdateOperationsInput | number
    contentWarning?: NullableStringFieldUpdateOperationsInput | string | null
    isHidden?: BoolFieldUpdateOperationsInput | boolean
    reportCount?: IntFieldUpdateOperationsInput | number
    publishedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    editedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    author?: UserAccountUpdateOneRequiredWithoutPostsNestedInput
    persona?: PersonaUpdateOneWithoutPostsNestedInput
    thread?: ThreadUpdateOneRequiredWithoutPostsNestedInput
    parentPost?: PostUpdateOneWithoutRepliesNestedInput
    newsItem?: NewsItemUpdateOneWithoutRelatedPostsNestedInput
    replies?: PostUpdateManyWithoutParentPostNestedInput
    reposts?: PostUpdateManyWithoutRepostOfNestedInput
    reactions?: ReactionUpdateManyWithoutPostNestedInput
  }

  export type PostUncheckedUpdateWithoutRepostOfInput = {
    id?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    personaId?: NullableStringFieldUpdateOperationsInput | string | null
    content?: StringFieldUpdateOperationsInput | string
    mediaUrls?: PostUpdatemediaUrlsInput | string[]
    linkPreview?: NullableJsonNullValueInput | InputJsonValue
    threadId?: StringFieldUpdateOperationsInput | string
    parentPostId?: NullableStringFieldUpdateOperationsInput | string | null
    isAIGenerated?: BoolFieldUpdateOperationsInput | boolean
    hashtags?: PostUpdatehashtagsInput | string[]
    mentions?: PostUpdatementionsInput | string[]
    newsItemId?: NullableStringFieldUpdateOperationsInput | string | null
    newsContext?: NullableStringFieldUpdateOperationsInput | string | null
    likeCount?: IntFieldUpdateOperationsInput | number
    repostCount?: IntFieldUpdateOperationsInput | number
    commentCount?: IntFieldUpdateOperationsInput | number
    impressionCount?: IntFieldUpdateOperationsInput | number
    contentWarning?: NullableStringFieldUpdateOperationsInput | string | null
    isHidden?: BoolFieldUpdateOperationsInput | boolean
    reportCount?: IntFieldUpdateOperationsInput | number
    publishedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    editedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    replies?: PostUncheckedUpdateManyWithoutParentPostNestedInput
    reposts?: PostUncheckedUpdateManyWithoutRepostOfNestedInput
    reactions?: ReactionUncheckedUpdateManyWithoutPostNestedInput
  }

  export type PostUncheckedUpdateManyWithoutRepostOfInput = {
    id?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    personaId?: NullableStringFieldUpdateOperationsInput | string | null
    content?: StringFieldUpdateOperationsInput | string
    mediaUrls?: PostUpdatemediaUrlsInput | string[]
    linkPreview?: NullableJsonNullValueInput | InputJsonValue
    threadId?: StringFieldUpdateOperationsInput | string
    parentPostId?: NullableStringFieldUpdateOperationsInput | string | null
    isAIGenerated?: BoolFieldUpdateOperationsInput | boolean
    hashtags?: PostUpdatehashtagsInput | string[]
    mentions?: PostUpdatementionsInput | string[]
    newsItemId?: NullableStringFieldUpdateOperationsInput | string | null
    newsContext?: NullableStringFieldUpdateOperationsInput | string | null
    likeCount?: IntFieldUpdateOperationsInput | number
    repostCount?: IntFieldUpdateOperationsInput | number
    commentCount?: IntFieldUpdateOperationsInput | number
    impressionCount?: IntFieldUpdateOperationsInput | number
    contentWarning?: NullableStringFieldUpdateOperationsInput | string | null
    isHidden?: BoolFieldUpdateOperationsInput | boolean
    reportCount?: IntFieldUpdateOperationsInput | number
    publishedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    editedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReactionUpdateWithoutPostInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumReactionTypeFieldUpdateOperationsInput | $Enums.ReactionType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserAccountUpdateOneRequiredWithoutReactionsNestedInput
  }

  export type ReactionUncheckedUpdateWithoutPostInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: EnumReactionTypeFieldUpdateOperationsInput | $Enums.ReactionType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReactionUncheckedUpdateManyWithoutPostInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: EnumReactionTypeFieldUpdateOperationsInput | $Enums.ReactionType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PostCreateManyThreadInput = {
    id?: string
    authorId: string
    personaId?: string | null
    content: string
    mediaUrls?: PostCreatemediaUrlsInput | string[]
    linkPreview?: NullableJsonNullValueInput | InputJsonValue
    parentPostId?: string | null
    repostOfId?: string | null
    isAIGenerated?: boolean
    hashtags?: PostCreatehashtagsInput | string[]
    mentions?: PostCreatementionsInput | string[]
    newsItemId?: string | null
    newsContext?: string | null
    likeCount?: number
    repostCount?: number
    commentCount?: number
    impressionCount?: number
    contentWarning?: string | null
    isHidden?: boolean
    reportCount?: number
    publishedAt?: Date | string
    editedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PostUpdateWithoutThreadInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    mediaUrls?: PostUpdatemediaUrlsInput | string[]
    linkPreview?: NullableJsonNullValueInput | InputJsonValue
    isAIGenerated?: BoolFieldUpdateOperationsInput | boolean
    hashtags?: PostUpdatehashtagsInput | string[]
    mentions?: PostUpdatementionsInput | string[]
    newsContext?: NullableStringFieldUpdateOperationsInput | string | null
    likeCount?: IntFieldUpdateOperationsInput | number
    repostCount?: IntFieldUpdateOperationsInput | number
    commentCount?: IntFieldUpdateOperationsInput | number
    impressionCount?: IntFieldUpdateOperationsInput | number
    contentWarning?: NullableStringFieldUpdateOperationsInput | string | null
    isHidden?: BoolFieldUpdateOperationsInput | boolean
    reportCount?: IntFieldUpdateOperationsInput | number
    publishedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    editedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    author?: UserAccountUpdateOneRequiredWithoutPostsNestedInput
    persona?: PersonaUpdateOneWithoutPostsNestedInput
    parentPost?: PostUpdateOneWithoutRepliesNestedInput
    repostOf?: PostUpdateOneWithoutRepostsNestedInput
    newsItem?: NewsItemUpdateOneWithoutRelatedPostsNestedInput
    replies?: PostUpdateManyWithoutParentPostNestedInput
    reposts?: PostUpdateManyWithoutRepostOfNestedInput
    reactions?: ReactionUpdateManyWithoutPostNestedInput
  }

  export type PostUncheckedUpdateWithoutThreadInput = {
    id?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    personaId?: NullableStringFieldUpdateOperationsInput | string | null
    content?: StringFieldUpdateOperationsInput | string
    mediaUrls?: PostUpdatemediaUrlsInput | string[]
    linkPreview?: NullableJsonNullValueInput | InputJsonValue
    parentPostId?: NullableStringFieldUpdateOperationsInput | string | null
    repostOfId?: NullableStringFieldUpdateOperationsInput | string | null
    isAIGenerated?: BoolFieldUpdateOperationsInput | boolean
    hashtags?: PostUpdatehashtagsInput | string[]
    mentions?: PostUpdatementionsInput | string[]
    newsItemId?: NullableStringFieldUpdateOperationsInput | string | null
    newsContext?: NullableStringFieldUpdateOperationsInput | string | null
    likeCount?: IntFieldUpdateOperationsInput | number
    repostCount?: IntFieldUpdateOperationsInput | number
    commentCount?: IntFieldUpdateOperationsInput | number
    impressionCount?: IntFieldUpdateOperationsInput | number
    contentWarning?: NullableStringFieldUpdateOperationsInput | string | null
    isHidden?: BoolFieldUpdateOperationsInput | boolean
    reportCount?: IntFieldUpdateOperationsInput | number
    publishedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    editedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    replies?: PostUncheckedUpdateManyWithoutParentPostNestedInput
    reposts?: PostUncheckedUpdateManyWithoutRepostOfNestedInput
    reactions?: ReactionUncheckedUpdateManyWithoutPostNestedInput
  }

  export type PostUncheckedUpdateManyWithoutThreadInput = {
    id?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    personaId?: NullableStringFieldUpdateOperationsInput | string | null
    content?: StringFieldUpdateOperationsInput | string
    mediaUrls?: PostUpdatemediaUrlsInput | string[]
    linkPreview?: NullableJsonNullValueInput | InputJsonValue
    parentPostId?: NullableStringFieldUpdateOperationsInput | string | null
    repostOfId?: NullableStringFieldUpdateOperationsInput | string | null
    isAIGenerated?: BoolFieldUpdateOperationsInput | boolean
    hashtags?: PostUpdatehashtagsInput | string[]
    mentions?: PostUpdatementionsInput | string[]
    newsItemId?: NullableStringFieldUpdateOperationsInput | string | null
    newsContext?: NullableStringFieldUpdateOperationsInput | string | null
    likeCount?: IntFieldUpdateOperationsInput | number
    repostCount?: IntFieldUpdateOperationsInput | number
    commentCount?: IntFieldUpdateOperationsInput | number
    impressionCount?: IntFieldUpdateOperationsInput | number
    contentWarning?: NullableStringFieldUpdateOperationsInput | string | null
    isHidden?: BoolFieldUpdateOperationsInput | boolean
    reportCount?: IntFieldUpdateOperationsInput | number
    publishedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    editedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PostCreateManyPersonaInput = {
    id?: string
    authorId: string
    content: string
    mediaUrls?: PostCreatemediaUrlsInput | string[]
    linkPreview?: NullableJsonNullValueInput | InputJsonValue
    threadId: string
    parentPostId?: string | null
    repostOfId?: string | null
    isAIGenerated?: boolean
    hashtags?: PostCreatehashtagsInput | string[]
    mentions?: PostCreatementionsInput | string[]
    newsItemId?: string | null
    newsContext?: string | null
    likeCount?: number
    repostCount?: number
    commentCount?: number
    impressionCount?: number
    contentWarning?: string | null
    isHidden?: boolean
    reportCount?: number
    publishedAt?: Date | string
    editedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PostUpdateWithoutPersonaInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    mediaUrls?: PostUpdatemediaUrlsInput | string[]
    linkPreview?: NullableJsonNullValueInput | InputJsonValue
    isAIGenerated?: BoolFieldUpdateOperationsInput | boolean
    hashtags?: PostUpdatehashtagsInput | string[]
    mentions?: PostUpdatementionsInput | string[]
    newsContext?: NullableStringFieldUpdateOperationsInput | string | null
    likeCount?: IntFieldUpdateOperationsInput | number
    repostCount?: IntFieldUpdateOperationsInput | number
    commentCount?: IntFieldUpdateOperationsInput | number
    impressionCount?: IntFieldUpdateOperationsInput | number
    contentWarning?: NullableStringFieldUpdateOperationsInput | string | null
    isHidden?: BoolFieldUpdateOperationsInput | boolean
    reportCount?: IntFieldUpdateOperationsInput | number
    publishedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    editedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    author?: UserAccountUpdateOneRequiredWithoutPostsNestedInput
    thread?: ThreadUpdateOneRequiredWithoutPostsNestedInput
    parentPost?: PostUpdateOneWithoutRepliesNestedInput
    repostOf?: PostUpdateOneWithoutRepostsNestedInput
    newsItem?: NewsItemUpdateOneWithoutRelatedPostsNestedInput
    replies?: PostUpdateManyWithoutParentPostNestedInput
    reposts?: PostUpdateManyWithoutRepostOfNestedInput
    reactions?: ReactionUpdateManyWithoutPostNestedInput
  }

  export type PostUncheckedUpdateWithoutPersonaInput = {
    id?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    mediaUrls?: PostUpdatemediaUrlsInput | string[]
    linkPreview?: NullableJsonNullValueInput | InputJsonValue
    threadId?: StringFieldUpdateOperationsInput | string
    parentPostId?: NullableStringFieldUpdateOperationsInput | string | null
    repostOfId?: NullableStringFieldUpdateOperationsInput | string | null
    isAIGenerated?: BoolFieldUpdateOperationsInput | boolean
    hashtags?: PostUpdatehashtagsInput | string[]
    mentions?: PostUpdatementionsInput | string[]
    newsItemId?: NullableStringFieldUpdateOperationsInput | string | null
    newsContext?: NullableStringFieldUpdateOperationsInput | string | null
    likeCount?: IntFieldUpdateOperationsInput | number
    repostCount?: IntFieldUpdateOperationsInput | number
    commentCount?: IntFieldUpdateOperationsInput | number
    impressionCount?: IntFieldUpdateOperationsInput | number
    contentWarning?: NullableStringFieldUpdateOperationsInput | string | null
    isHidden?: BoolFieldUpdateOperationsInput | boolean
    reportCount?: IntFieldUpdateOperationsInput | number
    publishedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    editedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    replies?: PostUncheckedUpdateManyWithoutParentPostNestedInput
    reposts?: PostUncheckedUpdateManyWithoutRepostOfNestedInput
    reactions?: ReactionUncheckedUpdateManyWithoutPostNestedInput
  }

  export type PostUncheckedUpdateManyWithoutPersonaInput = {
    id?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    mediaUrls?: PostUpdatemediaUrlsInput | string[]
    linkPreview?: NullableJsonNullValueInput | InputJsonValue
    threadId?: StringFieldUpdateOperationsInput | string
    parentPostId?: NullableStringFieldUpdateOperationsInput | string | null
    repostOfId?: NullableStringFieldUpdateOperationsInput | string | null
    isAIGenerated?: BoolFieldUpdateOperationsInput | boolean
    hashtags?: PostUpdatehashtagsInput | string[]
    mentions?: PostUpdatementionsInput | string[]
    newsItemId?: NullableStringFieldUpdateOperationsInput | string | null
    newsContext?: NullableStringFieldUpdateOperationsInput | string | null
    likeCount?: IntFieldUpdateOperationsInput | number
    repostCount?: IntFieldUpdateOperationsInput | number
    commentCount?: IntFieldUpdateOperationsInput | number
    impressionCount?: IntFieldUpdateOperationsInput | number
    contentWarning?: NullableStringFieldUpdateOperationsInput | string | null
    isHidden?: BoolFieldUpdateOperationsInput | boolean
    reportCount?: IntFieldUpdateOperationsInput | number
    publishedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    editedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PostCreateManyNewsItemInput = {
    id?: string
    authorId: string
    personaId?: string | null
    content: string
    mediaUrls?: PostCreatemediaUrlsInput | string[]
    linkPreview?: NullableJsonNullValueInput | InputJsonValue
    threadId: string
    parentPostId?: string | null
    repostOfId?: string | null
    isAIGenerated?: boolean
    hashtags?: PostCreatehashtagsInput | string[]
    mentions?: PostCreatementionsInput | string[]
    newsContext?: string | null
    likeCount?: number
    repostCount?: number
    commentCount?: number
    impressionCount?: number
    contentWarning?: string | null
    isHidden?: boolean
    reportCount?: number
    publishedAt?: Date | string
    editedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TrendUpdateWithoutNewsItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    hashtag?: NullableStringFieldUpdateOperationsInput | string | null
    keyword?: NullableStringFieldUpdateOperationsInput | string | null
    topic?: StringFieldUpdateOperationsInput | string
    postCount?: IntFieldUpdateOperationsInput | number
    uniqueUsers?: IntFieldUpdateOperationsInput | number
    impressionCount?: IntFieldUpdateOperationsInput | number
    engagementCount?: IntFieldUpdateOperationsInput | number
    trendScore?: IntFieldUpdateOperationsInput | number
    velocity?: FloatFieldUpdateOperationsInput | number
    peakTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    category?: EnumTrendCategoryFieldUpdateOperationsInput | $Enums.TrendCategory
    region?: NullableStringFieldUpdateOperationsInput | string | null
    language?: StringFieldUpdateOperationsInput | string
    isPromoted?: BoolFieldUpdateOperationsInput | boolean
    isHidden?: BoolFieldUpdateOperationsInput | boolean
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TrendUncheckedUpdateWithoutNewsItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    hashtag?: NullableStringFieldUpdateOperationsInput | string | null
    keyword?: NullableStringFieldUpdateOperationsInput | string | null
    topic?: StringFieldUpdateOperationsInput | string
    postCount?: IntFieldUpdateOperationsInput | number
    uniqueUsers?: IntFieldUpdateOperationsInput | number
    impressionCount?: IntFieldUpdateOperationsInput | number
    engagementCount?: IntFieldUpdateOperationsInput | number
    trendScore?: IntFieldUpdateOperationsInput | number
    velocity?: FloatFieldUpdateOperationsInput | number
    peakTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    category?: EnumTrendCategoryFieldUpdateOperationsInput | $Enums.TrendCategory
    region?: NullableStringFieldUpdateOperationsInput | string | null
    language?: StringFieldUpdateOperationsInput | string
    isPromoted?: BoolFieldUpdateOperationsInput | boolean
    isHidden?: BoolFieldUpdateOperationsInput | boolean
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TrendUncheckedUpdateManyWithoutNewsItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    hashtag?: NullableStringFieldUpdateOperationsInput | string | null
    keyword?: NullableStringFieldUpdateOperationsInput | string | null
    topic?: StringFieldUpdateOperationsInput | string
    postCount?: IntFieldUpdateOperationsInput | number
    uniqueUsers?: IntFieldUpdateOperationsInput | number
    impressionCount?: IntFieldUpdateOperationsInput | number
    engagementCount?: IntFieldUpdateOperationsInput | number
    trendScore?: IntFieldUpdateOperationsInput | number
    velocity?: FloatFieldUpdateOperationsInput | number
    peakTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    category?: EnumTrendCategoryFieldUpdateOperationsInput | $Enums.TrendCategory
    region?: NullableStringFieldUpdateOperationsInput | string | null
    language?: StringFieldUpdateOperationsInput | string
    isPromoted?: BoolFieldUpdateOperationsInput | boolean
    isHidden?: BoolFieldUpdateOperationsInput | boolean
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PostUpdateWithoutNewsItemInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    mediaUrls?: PostUpdatemediaUrlsInput | string[]
    linkPreview?: NullableJsonNullValueInput | InputJsonValue
    isAIGenerated?: BoolFieldUpdateOperationsInput | boolean
    hashtags?: PostUpdatehashtagsInput | string[]
    mentions?: PostUpdatementionsInput | string[]
    newsContext?: NullableStringFieldUpdateOperationsInput | string | null
    likeCount?: IntFieldUpdateOperationsInput | number
    repostCount?: IntFieldUpdateOperationsInput | number
    commentCount?: IntFieldUpdateOperationsInput | number
    impressionCount?: IntFieldUpdateOperationsInput | number
    contentWarning?: NullableStringFieldUpdateOperationsInput | string | null
    isHidden?: BoolFieldUpdateOperationsInput | boolean
    reportCount?: IntFieldUpdateOperationsInput | number
    publishedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    editedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    author?: UserAccountUpdateOneRequiredWithoutPostsNestedInput
    persona?: PersonaUpdateOneWithoutPostsNestedInput
    thread?: ThreadUpdateOneRequiredWithoutPostsNestedInput
    parentPost?: PostUpdateOneWithoutRepliesNestedInput
    repostOf?: PostUpdateOneWithoutRepostsNestedInput
    replies?: PostUpdateManyWithoutParentPostNestedInput
    reposts?: PostUpdateManyWithoutRepostOfNestedInput
    reactions?: ReactionUpdateManyWithoutPostNestedInput
  }

  export type PostUncheckedUpdateWithoutNewsItemInput = {
    id?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    personaId?: NullableStringFieldUpdateOperationsInput | string | null
    content?: StringFieldUpdateOperationsInput | string
    mediaUrls?: PostUpdatemediaUrlsInput | string[]
    linkPreview?: NullableJsonNullValueInput | InputJsonValue
    threadId?: StringFieldUpdateOperationsInput | string
    parentPostId?: NullableStringFieldUpdateOperationsInput | string | null
    repostOfId?: NullableStringFieldUpdateOperationsInput | string | null
    isAIGenerated?: BoolFieldUpdateOperationsInput | boolean
    hashtags?: PostUpdatehashtagsInput | string[]
    mentions?: PostUpdatementionsInput | string[]
    newsContext?: NullableStringFieldUpdateOperationsInput | string | null
    likeCount?: IntFieldUpdateOperationsInput | number
    repostCount?: IntFieldUpdateOperationsInput | number
    commentCount?: IntFieldUpdateOperationsInput | number
    impressionCount?: IntFieldUpdateOperationsInput | number
    contentWarning?: NullableStringFieldUpdateOperationsInput | string | null
    isHidden?: BoolFieldUpdateOperationsInput | boolean
    reportCount?: IntFieldUpdateOperationsInput | number
    publishedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    editedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    replies?: PostUncheckedUpdateManyWithoutParentPostNestedInput
    reposts?: PostUncheckedUpdateManyWithoutRepostOfNestedInput
    reactions?: ReactionUncheckedUpdateManyWithoutPostNestedInput
  }

  export type PostUncheckedUpdateManyWithoutNewsItemInput = {
    id?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    personaId?: NullableStringFieldUpdateOperationsInput | string | null
    content?: StringFieldUpdateOperationsInput | string
    mediaUrls?: PostUpdatemediaUrlsInput | string[]
    linkPreview?: NullableJsonNullValueInput | InputJsonValue
    threadId?: StringFieldUpdateOperationsInput | string
    parentPostId?: NullableStringFieldUpdateOperationsInput | string | null
    repostOfId?: NullableStringFieldUpdateOperationsInput | string | null
    isAIGenerated?: BoolFieldUpdateOperationsInput | boolean
    hashtags?: PostUpdatehashtagsInput | string[]
    mentions?: PostUpdatementionsInput | string[]
    newsContext?: NullableStringFieldUpdateOperationsInput | string | null
    likeCount?: IntFieldUpdateOperationsInput | number
    repostCount?: IntFieldUpdateOperationsInput | number
    commentCount?: IntFieldUpdateOperationsInput | number
    impressionCount?: IntFieldUpdateOperationsInput | number
    contentWarning?: NullableStringFieldUpdateOperationsInput | string | null
    isHidden?: BoolFieldUpdateOperationsInput | boolean
    reportCount?: IntFieldUpdateOperationsInput | number
    publishedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    editedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NewsItemUpdateWithoutTrendsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    url?: StringFieldUpdateOperationsInput | string
    sourceName?: StringFieldUpdateOperationsInput | string
    sourceUrl?: StringFieldUpdateOperationsInput | string
    author?: NullableStringFieldUpdateOperationsInput | string | null
    category?: EnumNewsCategoryFieldUpdateOperationsInput | $Enums.NewsCategory
    topics?: NewsItemUpdatetopicsInput | string[]
    keywords?: NewsItemUpdatekeywordsInput | string[]
    entities?: NewsItemUpdateentitiesInput | string[]
    country?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    language?: StringFieldUpdateOperationsInput | string
    sentimentScore?: FloatFieldUpdateOperationsInput | number
    impactScore?: IntFieldUpdateOperationsInput | number
    controversyScore?: IntFieldUpdateOperationsInput | number
    publishedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    discoveredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    aiSummary?: NullableStringFieldUpdateOperationsInput | string | null
    topicTags?: NewsItemUpdatetopicTagsInput | string[]
    relatedPosts?: PostUpdateManyWithoutNewsItemNestedInput
  }

  export type NewsItemUncheckedUpdateWithoutTrendsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    url?: StringFieldUpdateOperationsInput | string
    sourceName?: StringFieldUpdateOperationsInput | string
    sourceUrl?: StringFieldUpdateOperationsInput | string
    author?: NullableStringFieldUpdateOperationsInput | string | null
    category?: EnumNewsCategoryFieldUpdateOperationsInput | $Enums.NewsCategory
    topics?: NewsItemUpdatetopicsInput | string[]
    keywords?: NewsItemUpdatekeywordsInput | string[]
    entities?: NewsItemUpdateentitiesInput | string[]
    country?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    language?: StringFieldUpdateOperationsInput | string
    sentimentScore?: FloatFieldUpdateOperationsInput | number
    impactScore?: IntFieldUpdateOperationsInput | number
    controversyScore?: IntFieldUpdateOperationsInput | number
    publishedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    discoveredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    aiSummary?: NullableStringFieldUpdateOperationsInput | string | null
    topicTags?: NewsItemUpdatetopicTagsInput | string[]
    relatedPosts?: PostUncheckedUpdateManyWithoutNewsItemNestedInput
  }

  export type NewsItemUncheckedUpdateManyWithoutTrendsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    url?: StringFieldUpdateOperationsInput | string
    sourceName?: StringFieldUpdateOperationsInput | string
    sourceUrl?: StringFieldUpdateOperationsInput | string
    author?: NullableStringFieldUpdateOperationsInput | string | null
    category?: EnumNewsCategoryFieldUpdateOperationsInput | $Enums.NewsCategory
    topics?: NewsItemUpdatetopicsInput | string[]
    keywords?: NewsItemUpdatekeywordsInput | string[]
    entities?: NewsItemUpdateentitiesInput | string[]
    country?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    language?: StringFieldUpdateOperationsInput | string
    sentimentScore?: FloatFieldUpdateOperationsInput | number
    impactScore?: IntFieldUpdateOperationsInput | number
    controversyScore?: IntFieldUpdateOperationsInput | number
    publishedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    discoveredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    aiSummary?: NullableStringFieldUpdateOperationsInput | string | null
    topicTags?: NewsItemUpdatetopicTagsInput | string[]
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use UserAccountCountOutputTypeDefaultArgs instead
     */
    export type UserAccountCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserAccountCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PoliticalAlignmentCountOutputTypeDefaultArgs instead
     */
    export type PoliticalAlignmentCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PoliticalAlignmentCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PostCountOutputTypeDefaultArgs instead
     */
    export type PostCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PostCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ThreadCountOutputTypeDefaultArgs instead
     */
    export type ThreadCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ThreadCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PersonaCountOutputTypeDefaultArgs instead
     */
    export type PersonaCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PersonaCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use NewsItemCountOutputTypeDefaultArgs instead
     */
    export type NewsItemCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = NewsItemCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TrendCountOutputTypeDefaultArgs instead
     */
    export type TrendCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TrendCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserAccountDefaultArgs instead
     */
    export type UserAccountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserAccountDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserProfileDefaultArgs instead
     */
    export type UserProfileArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserProfileDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PoliticalAlignmentDefaultArgs instead
     */
    export type PoliticalAlignmentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PoliticalAlignmentDefaultArgs<ExtArgs>
    /**
     * @deprecated Use InfluenceMetricsDefaultArgs instead
     */
    export type InfluenceMetricsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = InfluenceMetricsDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SettingsDefaultArgs instead
     */
    export type SettingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SettingsDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PostDefaultArgs instead
     */
    export type PostArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PostDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ThreadDefaultArgs instead
     */
    export type ThreadArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ThreadDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ReactionDefaultArgs instead
     */
    export type ReactionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ReactionDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PersonaDefaultArgs instead
     */
    export type PersonaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PersonaDefaultArgs<ExtArgs>
    /**
     * @deprecated Use NewsItemDefaultArgs instead
     */
    export type NewsItemArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = NewsItemDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TrendDefaultArgs instead
     */
    export type TrendArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TrendDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}