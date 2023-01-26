# CluckRead (開發中)
開源的本地本子閱讀器/管理倉庫，支援一鍵建立自己的私有本子網站

### 如何運行？
運行前，請先安裝 NodeJS & npm
```bash
git clone https://github.com/cluckbird/hentai-comic-reader.git
cd hentai-comic-reader
npm install
npm start
```

### 請注意
- 開發中，請手動編輯 `/server/db/book.db` (Sqlite3) 清空數據庫
- 如無法運行請手動創建 `/server/book/db` 目錄
- 本程式使用SQLite作為數據庫，無法承受高並發查詢
- 未有實現SQL過濾，可能有安全問題 (如需開放到公網，請自行實現SQL過濾)

### 示例

![image](https://ci.cncn3.cn/10d3ac759afa94b1b2245f570d5ac8be.png)
![image](https://ci.cncn3.cn/3d17ca5a2205ef6559149cc02375a2e7.png)

##### 支援行動裝置訪問

![image](https://ci.cncn3.cn/1f187148c18fec19e24770e70b5dc936.md.png)