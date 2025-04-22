import LotteryToken from "~/contracts/abi/LotteryToken.json";
import { TOKEN_ADDRESS } from "~/contracts/addresses";

export const useTokenContract = () => ({
  address: TOKEN_ADDRESS as `0x${string}`,
  abi: LotteryToken.abi,
});
