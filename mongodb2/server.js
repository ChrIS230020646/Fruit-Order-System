require('dotenv').config(); // 確保加載環境變量

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const port = 3019;

const app = express();
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));

// 連接到 MongoDB
mongoose.connect(process.env.ATLAS_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// 獲取數據庫連接對象
const db = mongoose.connection;

// 監聽連接事件
db.on('error', console.error.bind(console, '連接錯誤：'));
db.once('open', function() {
    console.log("成功連接到 MongoDB!");
});

// 定義模式
const studentSchema = new mongoose.Schema({
    name: String,
    email: String
});

const newCollectionSchema = new mongoose.Schema({
    Address: {
        Street: { type: String, required: true },
        Zipcode: { type: String, required: true },
        Building: { type: String, required: true },
        Coord: { type: [Number], required: true }  // 数组类型，包含经纬度
    },
    Borough: { type: String, required: true },
    Cuisine: { type: String, required: true },
    Grades: [
        {
            Date: { type: Date, required: true },
            Grade: { type: String, required: true },
            Score: { type: Number, required: true }
        }
    ],
    Name: { type: String, required: true },
    Restaurant_id: { type: String, required: true }
});

const Student = mongoose.model('student', studentSchema);
const Collection = mongoose.model('newcollection', newCollectionSchema);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'form.html'));
});

app.post('/submit', async (req, res) => {
    const newStudent = new Student({
        name: req.body.name,
        email: req.body.email
    });
    
    try {
        //------------------------------------------------------------------------------------------------
        await newStudent.save();
        //------------------------------------------------------------------------------------------------
        res.send("數據成功保存!");
    } catch (err) {
        res.status(500).send("保存數據時出錯。");
    }
});

// 處理 /get 路由
app.post('/get', async (req, res) => {
    const studentName = req.body.name; // 從表單中獲取名稱
    console.log("收到的名稱:", studentName); // 輸出名稱到控制台
    
    try {
        // 查詢 MongoDB 中是否存在該學生的電子郵件
        //------------------------------------------------------------------------------------------------
        const student = await Student.find({ name: studentName });
        //------------------------------------------------------------------------------------------------
        if (student) {
            // 找到學生，返回電子郵件
            res.send(`收到的名稱是：${studentName}，電子郵件是：${student.email}`);
        } else {
            // 未找到學生
            res.send(`未找到名稱為 ${studentName} 的學生。`);
        }
    } catch (err) {
        console.error("查詢錯誤：", err);
        res.status(500).send("伺服器錯誤，請稍後再試。");
    }
});

// 處理編輯學生的 /edit 路由
app.post('/edit', async (req, res) => {
    const studentName = req.body.editName; // 從表單中獲取名稱
    const newEmail = req.body.editEmail; // 從表單中獲取新的電子郵件

    try {
        // 查詢並更新學生的電子郵件
        //------------------------------------------------------------------------------------------------
        const updatedStudent = await Student.findOneAndUpdate(
            { name: studentName },
            { email: newEmail },
            { new: true } // 返回更新後的文檔
        );
        //------------------------------------------------------------------------------------------------
        if (updatedStudent) {
            res.send(`學生 ${studentName} 的電子郵件已更新為：${newEmail}`);
        } else {
            res.send(`未找到名稱為 ${studentName} 的學生。`);
        }
    } catch (err) {
        console.error("更新錯誤：", err);
        res.status(500).send("伺服器錯誤，請稍後再試。");
    }
});

app.post('/remove', async (req, res) => {
    const studentName = req.body.removeName; // 從表單中獲取名稱
    try {
        const deletedStudent = await Student.findOneAndDelete(
            { name : studentName }
        );
        if (deletedStudent) {
            res.send(`學生 ${studentName} 已被刪除。`);
        } else {
            res.send(`未找到名稱為 ${studentName} 的學生。`);
        }
    } catch (err) {
        console.error("刪除錯誤：", err);
        res.status(500).send("伺服器錯誤，請稍後再試。");
    }
});

app.post('/save', async (req, res) => {
    try {
        const newData = {
            Address: {
                Street: "3 Avenue",
                Zipcode: "10075",
                Building: "1480",
                Coord: [-73.9557413, 40.7720266]
            },
            Borough: "Manhattan",
            Cuisine: "Atalian",
            Grades: [
                {
                    Date: new Date("2014-10-01T00:00:00Z"),
                    Grade: "A",
                    Score: 11
                },
                {
                    Date: new Date("2014-01-16T00:00:00Z"),
                    Grade: "B",
                    Score: 17
                },
                 {
                    Date: new Date("2014-01-16T00:00:00Z"),
                    Grade: "C",
                    Score: 15
                },
                 {
                    Date: new Date("2014-01-16T00:00:00Z"),
                    Grade: "D",
                    Score: 30
                },
                 {
                    Date: new Date("2014-01-16T00:00:00Z"),
                    Grade: "E",
                    Score: 20
                }
            ],
            Name: "Cella",
            Restaurant_id: "49444620"
        };

        const newCollection = new Collection(newData);
        await newCollection.save(); // 保存文档

        res.send("數據成功保存!");
    } catch (err) {
        console.error(err); // 记录错误
        res.status(500).send("保存數據時出錯。");
    }
});

app.post('/Avg', async (req, res) => {
    try {
        const results = await Collection.aggregate([
               {
                $unwind: "$Grades" // 展开 Grades 数组
            },
            {
                $group: {
                    _id: "$Borough",
                    averageScore: { $avg: "$Grades.Score" }
                }
            }
        ]);
        const Average = results.map(result => {
            return result._id + " 的平均分數是：" + result.averageScore + " <br>";
        });
        res.send(Average.join(''));
    } catch (err) {
        console.error(err);
        res.status(500).send("分組查詢時出錯。");
    }
});

app.post('/sum', async (req, res) => {
    try {
        const results = await Collection.aggregate([
               {
                $unwind: "$Grades" // 展开 Grades 数组
            },
            {
                $group: {
                    _id: "$Borough",
                    sumScore: { $sum: "$Grades.Score" }
                }
            }
        ]);

        const scoreMessages = results.map(result => {
            return `${result._id} 的分數總和是：${result.sumScore} <br>`;
        });
        res.send(scoreMessages.join(''));

        
        
    } catch (err) {
        console.error(err);
        res.status(500).send("分組查詢時出錯。");
    }
});


app.listen(port, () => {
    console.log("伺服器正在運行，端口：" + port);
});