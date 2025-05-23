/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "../common";

export interface PoolInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "category"
      | "contribute"
      | "contributions"
      | "createdAt"
      | "creator"
      | "deadline"
      | "description"
      | "getMyContribution"
      | "getTotalBalance"
      | "goal"
      | "minContribution"
      | "name"
      | "visibility"
      | "withdraw"
      | "withdrawn"
  ): FunctionFragment;

  getEvent(nameOrSignatureOrTopic: "Contributed" | "Withdrawn"): EventFragment;

  encodeFunctionData(functionFragment: "category", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "contribute",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "contributions",
    values: [AddressLike]
  ): string;
  encodeFunctionData(functionFragment: "createdAt", values?: undefined): string;
  encodeFunctionData(functionFragment: "creator", values?: undefined): string;
  encodeFunctionData(functionFragment: "deadline", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "description",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getMyContribution",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getTotalBalance",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "goal", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "minContribution",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "name", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "visibility",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "withdraw", values?: undefined): string;
  encodeFunctionData(functionFragment: "withdrawn", values?: undefined): string;

  decodeFunctionResult(functionFragment: "category", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "contribute", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "contributions",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "createdAt", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "creator", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "deadline", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "description",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getMyContribution",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getTotalBalance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "goal", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "minContribution",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "name", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "visibility", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "withdrawn", data: BytesLike): Result;
}

export namespace ContributedEvent {
  export type InputTuple = [contributor: AddressLike, amount: BigNumberish];
  export type OutputTuple = [contributor: string, amount: bigint];
  export interface OutputObject {
    contributor: string;
    amount: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace WithdrawnEvent {
  export type InputTuple = [to: AddressLike, amount: BigNumberish];
  export type OutputTuple = [to: string, amount: bigint];
  export interface OutputObject {
    to: string;
    amount: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface Pool extends BaseContract {
  connect(runner?: ContractRunner | null): Pool;
  waitForDeployment(): Promise<this>;

  interface: PoolInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  category: TypedContractMethod<[], [string], "view">;

  contribute: TypedContractMethod<[], [void], "payable">;

  contributions: TypedContractMethod<[arg0: AddressLike], [bigint], "view">;

  createdAt: TypedContractMethod<[], [bigint], "view">;

  creator: TypedContractMethod<[], [string], "view">;

  deadline: TypedContractMethod<[], [bigint], "view">;

  description: TypedContractMethod<[], [string], "view">;

  getMyContribution: TypedContractMethod<[], [bigint], "view">;

  getTotalBalance: TypedContractMethod<[], [bigint], "view">;

  goal: TypedContractMethod<[], [bigint], "view">;

  minContribution: TypedContractMethod<[], [bigint], "view">;

  name: TypedContractMethod<[], [string], "view">;

  visibility: TypedContractMethod<[], [string], "view">;

  withdraw: TypedContractMethod<[], [void], "nonpayable">;

  withdrawn: TypedContractMethod<[], [boolean], "view">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "category"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "contribute"
  ): TypedContractMethod<[], [void], "payable">;
  getFunction(
    nameOrSignature: "contributions"
  ): TypedContractMethod<[arg0: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "createdAt"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "creator"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "deadline"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "description"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "getMyContribution"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "getTotalBalance"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "goal"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "minContribution"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "name"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "visibility"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "withdraw"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "withdrawn"
  ): TypedContractMethod<[], [boolean], "view">;

  getEvent(
    key: "Contributed"
  ): TypedContractEvent<
    ContributedEvent.InputTuple,
    ContributedEvent.OutputTuple,
    ContributedEvent.OutputObject
  >;
  getEvent(
    key: "Withdrawn"
  ): TypedContractEvent<
    WithdrawnEvent.InputTuple,
    WithdrawnEvent.OutputTuple,
    WithdrawnEvent.OutputObject
  >;

  filters: {
    "Contributed(address,uint256)": TypedContractEvent<
      ContributedEvent.InputTuple,
      ContributedEvent.OutputTuple,
      ContributedEvent.OutputObject
    >;
    Contributed: TypedContractEvent<
      ContributedEvent.InputTuple,
      ContributedEvent.OutputTuple,
      ContributedEvent.OutputObject
    >;

    "Withdrawn(address,uint256)": TypedContractEvent<
      WithdrawnEvent.InputTuple,
      WithdrawnEvent.OutputTuple,
      WithdrawnEvent.OutputObject
    >;
    Withdrawn: TypedContractEvent<
      WithdrawnEvent.InputTuple,
      WithdrawnEvent.OutputTuple,
      WithdrawnEvent.OutputObject
    >;
  };
}
