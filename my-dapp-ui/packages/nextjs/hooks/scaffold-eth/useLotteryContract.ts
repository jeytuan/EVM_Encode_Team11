import Lottery from "~/contracts/abi/Lottery.json";
import { LOTTERY_ADDRESS } from "~/contracts/addresses";

export const useLotteryContract = () => ({
  address: LOTTERY_ADDRESS as `0x${string}`,
  abi: Lottery.abi,
});
