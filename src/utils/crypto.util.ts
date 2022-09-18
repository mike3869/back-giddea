import cryptoJs from "crypto-js";

const keySize: number = 212;//256
const ivSize: number = 128;//128
const iterations: number = 118;//125

export const sign = (_payload: any, _secretOrPrivateKey: string) => {
  const promise = new Promise(async (accept, reject) => {
    try {
      let payload = _payload;
      const msg = JSON.stringify(payload);
      const pass = _secretOrPrivateKey;
      let salt = cryptoJs.lib.WordArray.random(128 / 8);
      let key = cryptoJs.PBKDF2(pass, salt, {
        keySize: keySize / 32,
        iterations: iterations,
      });
      let iv = cryptoJs.lib.WordArray.random(128 / 8);
      let encrypted = cryptoJs.AES.encrypt(msg, key, {
        iv: iv,
        padding: cryptoJs.pad.Pkcs7,
        mode: cryptoJs.mode.CBC,
      });
      // salt, iv will be hex 32 in length
      // append them to the ciphertext for use  in decryption
      let transitmessage =
        salt.toString() + iv.toString() + encrypted.toString();
      accept(transitmessage);
    } catch (error) {
      if (error instanceof Error) {
        reject({ msg: error.message });
      } else {
        reject(error);
      }
    }
  });
  return promise;
};

export const verify = (
  _encryptedPayload: string,
  _secretOrPrivateKey: string
) => {
  const promise = new Promise(async (accept, reject) => {
    try {
      const transitmessage = _encryptedPayload;
      const pass = _secretOrPrivateKey;
      let salt = cryptoJs.enc.Hex.parse(transitmessage.substr(0, 32));
      let iv = cryptoJs.enc.Hex.parse(transitmessage.substr(32, 32));
      let encrypted = transitmessage.substring(64);
      let key = cryptoJs.PBKDF2(pass, salt, {
        keySize: keySize / 32,
        iterations: iterations,
      });
      let decrypted = cryptoJs.AES.decrypt(encrypted, key, {
        iv: iv,
        padding: cryptoJs.pad.Pkcs7,
        mode: cryptoJs.mode.CBC,
      });
      let str = decrypted.toString(cryptoJs.enc.Utf8);
      if (str == "") throw { code: 401, msg: "Invalid payload" };
      let payload = JSON.parse(str);
      accept(payload);
    } catch (error) {
      if (error instanceof Error) {
        reject({ msg: error.message });
      } else {
        reject(error);
      }
    }
  });
  return promise;
};

