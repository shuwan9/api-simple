const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
app.use(express.static("public"));
app.use(bodyParser.json());

app.post("/api/exec/update", function (req, res) {
  const code = updateData(req.body);
  res.json({
    code,
  });
});
app.get("/api/exec/fingerPrint", function (req, res) {
  const query = req.query;
  if (query && query.fingerPrint) {
    const data = getData();
    const lastFingerPrint = data.fingerPrint;
    const code = updateData({
      fingerPrint: lastFingerPrint
        ? lastFingerPrint + "," + query.fingerPrint
        : query.fingerPrint,
    });
    res.json({
      code,
    });
  } else {
    res.json({
      code: 1,
      message: "required param fingerPrint",
    });
  }
});

function getData() {
  try {
    return JSON.parse(
      fs.readFileSync("./data.json", {
        encoding: "utf-8",
      })
    );
  } catch (e) {
    console.error(e);
    return {};
  }
}
function updateData(newData) {
  newData = newData || {};
  const data = getData();
  try {
    fs.writeFileSync(
      "./data.json",
      JSON.stringify(
        {
          ...data,
          ...newData,
        },
        null,
        2
      )
    );
    return 0;
  } catch (e) {
    console.error(e);
    return 1;
  }
}
app.get("/api/exec/get", function (req, res) {
  const data = getData();
  console.log(data);
  res.json({
    ...getData(),
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
