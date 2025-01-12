"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryKeyStore = void 0;
const keystore_1 = require("./keystore");
const key_pair_1 = require("../utils/key_pair");
/**
 * Simple in-memory keystore for mainly for testing purposes.
 *
 * @see [https://docs.near.org/docs/develop/front-end/naj-quick-reference#key-store](https://docs.near.org/docs/develop/front-end/naj-quick-reference#key-store)
 * @example
 * ```js
 * import { connect, keyStores, utils } from 'near-api-js';
 *
 * const privateKey = '.......';
 * const keyPair = utils.KeyPair.fromString(privateKey);
 *
 * const keyStore = new keyStores.InMemoryKeyStore();
 * keyStore.setKey('testnet', 'example-account.testnet', keyPair);
 *
 * const config = {
 *   keyStore, // instance of InMemoryKeyStore
 *   networkId: 'testnet',
 *   nodeUrl: 'https://rpc.testnet.near.org',
 *   walletUrl: 'https://wallet.testnet.near.org',
 *   helperUrl: 'https://helper.testnet.near.org',
 *   explorerUrl: 'https://explorer.testnet.near.org'
 * };
 *
 * // inside an async function
 * const near = await connect(config)
 * ```
 */
class InMemoryKeyStore extends keystore_1.KeyStore {
    constructor() {
        super();
        this.keys = {};
    }
    /**
     * Stores a {@link utils/key_pair!KeyPair} in in-memory storage item
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @param accountId The NEAR account tied to the key pair
     * @param keyPair The key pair to store in local storage
     */
    setKey(networkId, accountId, keyPair) {
        return __awaiter(this, void 0, void 0, function* () {
            this.keys[`${accountId}:${networkId}`] = keyPair.toString();
        });
    }
    /**
     * Gets a {@link utils/key_pair!KeyPair} from in-memory storage
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @param accountId The NEAR account tied to the key pair
     * @returns {Promise<KeyPair>}
     */
    getKey(networkId, accountId) {
        return __awaiter(this, void 0, void 0, function* () {
            const value = this.keys[`${accountId}:${networkId}`];
            if (!value) {
                return null;
            }
            return key_pair_1.KeyPair.fromString(value);
        });
    }
    /**
     * Removes a {@link utils/key_pair!KeyPair} from in-memory storage
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @param accountId The NEAR account tied to the key pair
     */
    removeKey(networkId, accountId) {
        return __awaiter(this, void 0, void 0, function* () {
            delete this.keys[`${accountId}:${networkId}`];
        });
    }
    /**
     * Removes all {@link utils/key_pair!KeyPair} from in-memory storage
     */
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            this.keys = {};
        });
    }
    /**
     * Get the network(s) from in-memory storage
     * @returns {Promise<string[]>}
     */
    getNetworks() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = new Set();
            Object.keys(this.keys).forEach((key) => {
                const parts = key.split(':');
                result.add(parts[1]);
            });
            return Array.from(result.values());
        });
    }
    /**
     * Gets the account(s) from in-memory storage
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     */
    getAccounts(networkId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = new Array();
            Object.keys(this.keys).forEach((key) => {
                const parts = key.split(':');
                if (parts[parts.length - 1] === networkId) {
                    result.push(parts.slice(0, parts.length - 1).join(':'));
                }
            });
            return result;
        });
    }
    /** @hidden */
    toString() {
        return 'InMemoryKeyStore';
    }
}
exports.InMemoryKeyStore = InMemoryKeyStore;
