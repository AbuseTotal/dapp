import { Web3Connection } from "@taikai/dappkit";

import { chainDict } from "../constants/networks";
import {
  IDappkitReactProvider,
  DappkitReactProviderEventReactor,
} from "./IDappkitReactProvider";

export interface DappkitReactProviderOptions {
  autonnect?: boolean;
  switchNetwork?: boolean;
  addNewortk?: boolean;
  disconnectOnSwitchAccount?: boolean;
  disconnectOnChangeNetwork?: boolean;
}

class DappkitReactProvider implements IDappkitReactProvider {
  private _connected = false;
  private _connectedChain = 0;
  private _isConnecting = false;
  private _connection: Web3Connection;
  private _rpcHost = "http://localhost:8545";
  private _chainId = 1;
  private _address = "";
  private _reactors: DappkitReactProviderEventReactor[] = [];

  private _options: DappkitReactProviderOptions = {
    autonnect: true,
    switchNetwork: true,
    addNewortk: true,
    disconnectOnSwitchAccount: false,
    disconnectOnChangeNetwork: false,
  };

  constructor(
    chainId: number,
    rpcHost: string,
    _options: DappkitReactProviderOptions
  ) {
    this._options = _options;
    this._chainId = chainId;
    this._rpcHost = rpcHost;
    this._connection = new Web3Connection({
      web3Host: this._rpcHost,
    });
  }

  getConnection(): Web3Connection {
    return this._connection;
  }

  subscribe(reactor: DappkitReactProviderEventReactor) {
   if (!this._reactors.includes(reactor)) {
      this._reactors.push(reactor);
    }
  }
  unsubscribe(reactor: DappkitReactProviderEventReactor) {
    if (this._reactors.includes(reactor)) {
      var index = this._reactors.indexOf(reactor);
      if (index !== -1) {
        this._reactors.splice(index, 1);
      }
    }
  }

  onError(e: Error) {
    this._reactors.forEach((reactor) => {
      if (reactor.onError) {
        reactor.onError(e);
      }
    });
  }

  isConnected(): boolean {
    return this._connected;
  }

  connectedChainId(): number {
    return this._connectedChain;
  }

  isConnecting() {
    return this._isConnecting;
  }

  getAddress(): string {
    return this._address;
  }
  getChainId(): number {
    return this._chainId;
  }

  async connect(): Promise<boolean> {
    this._isConnecting = true;
    try {
      await this._connection.start();
      // 1. Tries to connect
      const res = await this._connection.connect();
      // 2. Verify if you are connected to right network p.ex based on Network Id
      const connectedChainID = await this._connection.eth.getChainId();
      if (this._chainId !== connectedChainID) {
        // 3. Tries to force the change network
        if (this._options.switchNetwork) {
          this.switchNetwork(this._chainId);
        } else {
          this.onError(
            new Error(
              `You are connected to the wrong chain ${connectedChainID}`
            )
          );
          return false;
        }
      } else {
        await this._onConnectionReady(connectedChainID);
      }
    } catch (e: any) {
      this.onError(e);
      return false;
    } finally {
      this._isConnecting = false;
    }
    return true;
  }

  async disconnect(): Promise<boolean> {
    (window as any).ethereum.on("accountsChanged", () => {});
    (window as any).ethereum.on("chainChanged", () => {});
    this._connected = false;
    this._connectedChain = 0;
    this._address = "";
    this._reactors.forEach((reactor) => {
      if (reactor.onDisconnectEvent) {
        reactor.onDisconnectEvent({});
      }
    });
    return true;
  }

  async switchNetwork(chainId: number): Promise<boolean> {
    try {
      this._isConnecting = true;
      await (window as any).ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: this._connection.utils.numberToHex(chainId) }],
      });
      const connectedChainId = await this._connection.eth.getChainId();
      if (this._chainId !== connectedChainId) {
        this.onError(
          new Error(`Connected to the wrong Chain Id ${connectedChainId} `)
        );
      } else {
        await this._onConnectionReady(connectedChainId);
      }
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        if (this._options.addNewortk) {
          this.addNetwork();
        }
        this.onError(
          new Error(
            `Failed to Connect to Chain ${this._chainId} - Unrecognized Network`
          )
        );
      } else {
        this.onError(
          new Error(
            `Failed to Connect to Chain ${this._chainId} - ${switchError.message}`
          )
        );
      }
    } finally {
      this._isConnecting = false;
    }
    return true;
  }

  async addNetwork(): Promise<boolean> {
    try {
      this._isConnecting = true;
      await (window as any).ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: this._connection.utils.numberToHex(this._chainId),
            chainName: chainDict[this._chainId].name,
            rpcUrls: [chainDict[this._chainId].rpc],
          },
        ],
      });
      const connectedChainId = await this._connection.eth.getChainId();
      if (this._chainId !== connectedChainId) {
        this.onError(
          new Error(`Connected to the wrong Chain Id ${connectedChainId} `)
        );
        return false;
      } else {
        await this._onConnectionReady(connectedChainId);
      }
    } catch (addError: any) {
      this.onError(
        new Error(
          `Failed to Add Supported chain ${this._chainId} - ${addError.message}`
        )
      );
      return false;
    } finally {
      this._isConnecting = false;
    }
    return true;
  }

  _onAccountsChanged(newAddresses: string[]) {
    const newAddress =
      newAddresses && newAddresses.length > 0 ? newAddresses[0] : "";
    this._reactors.forEach((reactor) => {
      if (reactor.onChangeAccountEvent) {
        reactor.onChangeAccountEvent({
          address: newAddress,
        });
      }
    });
    if (
      this._options.disconnectOnSwitchAccount &&
      this._address &&
      newAddress &&
      newAddress != this._address
    ) {
      this.disconnect();
    }
  }

  _onChainChanged(newChainId: string) {
    this._reactors.forEach((reactor) => {
      if (reactor.onChangeNetworkEvent) {
        reactor.onChangeNetworkEvent({
          chainId: parseInt(newChainId),
        });
      }
    });
    if (
      this._options.disconnectOnChangeNetwork &&
      newChainId &&
      this._connection.utils.numberToHex(this._connectedChain) !== newChainId
    ) {
      this.disconnect();
    }
  }

  async _onConnectionReady(chainId: number) {
    if (!this._connected) {
      this._address = await this._connection.getAddress();
      this._connected = true;
      this._connectedChain = chainId;
      (window as any).ethereum.on(
        "accountsChanged",
        this._onAccountsChanged.bind(this)
      );
      (window as any).ethereum.on(
        "chainChanged",
        this._onChainChanged.bind(this)
      );
      this._reactors.forEach((reactor) => {
        if (reactor.onConnectionEvent) {
          reactor.onConnectionEvent({
            chainId: this._connectedChain,
            address: this._address,
          });
        }
      });
    }
  }
}

export default DappkitReactProvider;
