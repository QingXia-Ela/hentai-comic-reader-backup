# CluckRead

## 写在前面

这是一个开源的本地本子阅读器补档仓库，之前很早的时候就克隆下来了，但是后来想同步仓库时发现原仓库似乎被删除了：https://github.com/cluckbird/hentai-comic-reader

可能是因为作者不小心把私货也给放上去了，所以被迫删除。在此在这里补个档，如果有疑问或意见可以联系我或者提 issue 删除仓库

（虽然看了项目结构发现私货是在 .gitignore 里面来着，但是我发现压缩包里面确实有私货 :D）

原作者GitHub：https://github.com/cluckbird

简介里部分比较暴露的图给删掉了

未来的话要不试试用vue重做一个？

## 原简介

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

### 示例![image](https://ci.cncn3.cn/3d17ca5a2205ef6559149cc02375a2e7.png)

##### 支援行動裝置訪問
