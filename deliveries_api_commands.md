# Deliveries API - Windows CMD 命令參考

## 前置要求
- 生產環境已部署在：`https://fruit-order-system-1.onrender.com`
- 如果要在本地測試，需要先啟動本地服務器（`http://localhost:3020`）

## 方法 1：使用批處理腳本（推薦）

直接運行 `test_deliveries_api.bat` 文件，它會依次執行所有 4 個操作。

## 方法 2：手動執行單個命令

### 1. 顯示列表 (GET)

```cmd
curl -X GET https://fruit-order-system-1.onrender.com/deliveries/list
```

或使用本地開發環境：
```cmd
curl -X GET http://localhost:3020/deliveries/list
```

### 2. 插入新記錄 (POST)

```cmd
curl -X POST https://fruit-order-system-1.onrender.com/deliveries/insert -H "Content-Type: application/json" -d "{\"_id\": 123456, \"fromWarehouseId\": 1001, \"toLocationId\": 1002, \"fruitId\": 1, \"quantity\": 240, \"deliveryDate\": \"2023-04-03\", \"estimatedArrivalDate\": \"2023-04-04\", \"status\": \"Delivered\"}"
```
```

**注意**：Windows CMD 中，JSON 字符串需要使用雙引號，並且內部雙引號需要轉義（使用 `\"`）。

### 3. 更新記錄 (PUT)

```cmd
curl -X PUT https://fruit-order-system-1.onrender.com/deliveries/update/123456 -H "Content-Type: application/json" -d "{\"status\": \"In Transit\", \"quantity\": 300}"
```
```

### 4. 刪除記錄 (DELETE)

```cmd
curl -X DELETE https://fruit-order-system-1.onrender.com/deliveries/delete/123456
```

## 方法 3：使用多行命令（更易讀）

如果命令太長，可以使用 `^` 作為行續行符：

### 插入記錄（多行格式）

```cmd
curl -X POST https://fruit-order-system-1.onrender.com/deliveries/insert ^
  -H "Content-Type: application/json" ^
  -d "{\"_id\": 123456, \"fromWarehouseId\": 1001, \"toLocationId\": 1002, \"fruitId\": 1, \"quantity\": 240, \"deliveryDate\": \"2023-04-03\", \"estimatedArrivalDate\": \"2023-04-04\", \"status\": \"Delivered\"}"
```

### 更新記錄（多行格式）

```cmd
curl -X PUT https://fruit-order-system-1.onrender.com/deliveries/update/123456 ^
  -H "Content-Type: application/json" ^
  -d "{\"status\": \"In Transit\", \"quantity\": 300}"
```

## 方法 4：使用 JSON 文件（推薦用於複雜數據）

### 步驟 1：創建 JSON 文件

創建 `delivery_data.json`：
```json
{
  "_id": 123456,
  "fromWarehouseId": 1001,
  "toLocationId": 1002,
  "fruitId": 1,
  "quantity": 240,
  "deliveryDate": "2023-04-03",
  "estimatedArrivalDate": "2023-04-04",
  "status": "Delivered"
}
```

### 步驟 2：使用 JSON 文件執行命令

```cmd
curl -X POST https://fruit-order-system-1.onrender.com/deliveries/insert -H "Content-Type: application/json" -d @delivery_data.json
```

## 常見問題

### 問題 1：curl 命令未找到

**解決方案**：
- Windows 10 1803 及更高版本已內置 curl
- 如果沒有，可以下載並安裝 [curl for Windows](https://curl.se/windows/)
- 或者使用 PowerShell 的 `Invoke-WebRequest`（語法不同）

### 問題 2：JSON 格式錯誤

**解決方案**：
- 確保所有雙引號都正確轉義（使用 `\"`）
- 或者使用 JSON 文件方法（方法 4）

### 問題 3：連接被拒絕或超時

**解決方案**：
- Render 免費方案在 15 分鐘無活動後會休眠，首次訪問需要等待 15-30 秒喚醒
- 如果使用本地開發，確保後端服務器正在運行
- 檢查端口是否正確（本地默認是 3020）
- 檢查防火牆設置

## 切換到本地開發環境

如果需要測試本地環境，將所有命令中的 `https://fruit-order-system-1.onrender.com` 替換為 `http://localhost:3020` 即可。

