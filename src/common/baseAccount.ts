import { AccAddress } from "./address";
import { PubKey, PubKeySecp256k1 } from "../crypto";
import bigInteger from "big-integer";
import { Coin } from "./coin";
import { Int } from "./int";
import { Buffer } from "buffer/";
import { Account } from "../core/account";

export class BaseAccount implements Account {
  public static fromJSON(obj: any): BaseAccount {
    const supportedAccountType = [
      "auth/Account",
      "auth/BaseVestingAccount",
      "auth/ContinuousVestingAccount",
      "auth/DelayedVestingAccount"
    ];
    if (supportedAccountType.indexOf(obj.type) < 0) {
      throw new Error(`Unsupported account type: ${obj.type}`);
    }
    if (obj.value) {
      const value = obj.value;
      const address = AccAddress.fromBech32(value.address);
      const coins: Coin[] = [];
      for (const coin of value.coins) {
        coins.push(new Coin(coin.denom, new Int(coin.amount)));
      }
      let pubKey: PubKey;
      if (
        !value.public_key ||
        value.public_key.type !== "tendermint/PubKeySecp256k1"
      ) {
        throw new Error(
          `Unsupported public key type: ${value.public_key.type}`
        );
      }
      pubKey = new PubKeySecp256k1(
        Buffer.from(value.public_key.value, "base64")
      );
      const accountNumber = value.account_number;
      const sequence = value.sequence;

      return new BaseAccount(address, pubKey, accountNumber, sequence, coins);
    } else {
      throw new Error("Invalid base account");
    }
  }

  private address: AccAddress;
  private pubKey: PubKey;
  private accountNumber: bigInteger.BigInteger;
  private sequence: bigInteger.BigInteger;
  private coins: Coin[];

  constructor(
    address: AccAddress,
    pubKey: PubKey,
    accountNumber: bigInteger.BigNumber,
    sequence: bigInteger.BigNumber,
    coins: Coin[]
  ) {
    this.address = address;
    this.pubKey = pubKey;
    if (typeof accountNumber === "string") {
      this.accountNumber = bigInteger(accountNumber);
    } else if (typeof accountNumber === "number") {
      this.accountNumber = bigInteger(accountNumber);
    } else {
      this.accountNumber = bigInteger(accountNumber);
    }
    if (typeof sequence === "string") {
      this.sequence = bigInteger(sequence);
    } else if (typeof sequence === "number") {
      this.sequence = bigInteger(sequence);
    } else {
      this.sequence = bigInteger(sequence);
    }
    this.coins = coins;
  }

  public getAddress(): AccAddress {
    return this.address;
  }

  public getPubKey(): PubKey {
    return this.pubKey;
  }

  public getAccountNumber(): bigInteger.BigInteger {
    return this.accountNumber;
  }

  public getSequence(): bigInteger.BigInteger {
    return this.sequence;
  }

  public getCoins(): Coin[] {
    return this.coins;
  }
}
