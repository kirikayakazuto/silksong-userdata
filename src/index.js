import { Encode, Decode, Hash, DownloadData, HumanTime, AddGeoAndShellShardsNumber, PrintGeoAndShellShardsNumber } from "./functions.js"
import fs from 'fs'
import path from 'path'
import os from 'os'


// 获取当前用户目录
const userDir = os.homedir();

// 构造 Hollow Knight Silksong 的存档根目录路径
const basePath = path.join(
  userDir,
  "AppData",
  "LocalLow",
  "Team Cherry",
  "Hollow Knight Silksong"
);

try {
  if (!fs.existsSync(basePath)) {
    console.error("❌ 存档目录不存在:", basePath);
    process.exit(1);
  }

  // 获取 Hollow Knight Silksong 下的子目录
  const subDirs = fs.readdirSync(basePath).filter(name => {
    return /^\d+$/.test(name) && fs.statSync(path.join(basePath, name)).isDirectory();
  });

  if (subDirs.length === 0) {
    console.log("⚠️ 没有找到存档文件夹");
  } else {
    console.log("找到的存档文件夹:", subDirs);

    subDirs.forEach(dirName => {
      const user1Path = path.join(basePath, dirName, "user1.dat");

      if (fs.existsSync(user1Path)) {
        try {
          const data = fs.readFileSync(user1Path); // Buffer 类型
          console.log(`📂 ${dirName}/user1.dat 读取成功`);

          let decrypted = Decode(new Uint8Array(data));
          let jsonObj = JSON.parse(decrypted);

          PrintGeoAndShellShardsNumber(jsonObj);

          console.log("开始修改念珠和碎片数量");
          AddGeoAndShellShardsNumber(jsonObj, 2000, 5000);

          PrintGeoAndShellShardsNumber(jsonObj);

          let encrypted = Encode(JSON.stringify(jsonObj));
          fs.writeFileSync(user1Path, encrypted);
          
          console.log(`✅ ${dirName}/user1.dat 写入成功`);

        } catch (err) {
          console.error(`❌ 读取 ${dirName}/user1.dat 失败:`, err);
        }
      } else {
        console.warn(`⚠️ ${dirName} 下没有 user1.dat`);
      }
    });
  }
} catch (err) {
  console.error("运行时出错:", err);
}

process.stdin.resume();