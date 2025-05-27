require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  return res.status(200).json({ message: "Hello guys 🫡" });
});

const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "EPMS",
});

db.connect((e) => {
  if (e) throw e;
  console.log("DB Is connected 🌻");
});

// ------------ users --------------
const bcrypt = require("bcrypt");
app.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(406)
      .json({ message: "username , password are required" });
  }

  db.query("SELECT * FROM Users WHERE username = ?", [username], (gE, gR) => {
    if (gE)
      return res
        .status(500)
        .json({ message: "get User error", error: gE.message });
    if (gR.length !== 0)
      return res.status(400).json({ message: "username is ready exist" });

    bcrypt.hash(password, 10, (hE, hR) => {
      if (hE)
        return res.status(500).json({
          message: "Some thing went wrong to hash password",
          error: hE.message,
        });
      db.query(
        "INSERT INTO Users (username , password) VALUES (? ,?)",
        [username, hR],
        (iE, iR) => {
          if (iE)
            return res
              .status(500)
              .json({ message: "insert user error", error: iE.message });

          return res
            .status(201)
            .json({ message: "Create user successful", id: iR.insertId });
        }
      );
    });
  });
});

// -------------------login-------------------
const jwt = require("jsonwebtoken");
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(406)
      .json({ message: "username and password are required" });
  }

  db.query("SELECT * FROM Users WHERE username = ?", [username], (gE, gR) => {
    if (gE)
      return res
        .status(500)
        .json({ message: "Get user Err", error: gE.message });

    if (gR.length <= 0) {
      return res.status(404).json({ message: "username not found" });
    }

    const user = gR[0];

    bcrypt.compare(password, user.password, (cE, cR) => {
      if (cE)
        return res
          .status(500)
          .json({ message: "Compare Password error", error: cE.message });

      if (cR) {
        const token = jwt.sign(
          {
            username: user.userName,
            role: user.role,
            id: user.userId,
          },
          process.env.KEY,
          { expiresIn: "2days" }
        );

        delete user.password;
        return res
          .status(200)
          .json({ message: "login success full", user, token });
      } else {
        return res
          .status(200)
          .json({ message: "Password are not match", why: cR });
      }
    });
  });
});

app.get("/users/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM Users WHERE userId = ?", [id], (gE, gR) => {
    if (gE)
      return res
        .status(500)
        .json({ message: "Get users Err", error: gE.message });
    if (gR.length <= 0)
      return res.status(404).json({ message: "user don't exit" });
    return res.status(200).json(gR);
  });
});

app.get("/users", (req, res) => {
  db.query("SELECT * FROM Users", (gE, gR) => {
    if (gE)
      return res
        .status(500)
        .json({ message: "Get users Err", error: gE.message });
    return res.status(200).json(gR);
  });
});

// Continue from your existing backend code...

// ------------------- Department -------------------
app.post("/departments", (req, res) => {
  const { departmentCode, departmentName, grossSalary } = req.body;
  
  if (!departmentCode || !departmentName || !grossSalary) {
    return res.status(400).json({ message: "All department fields are required" });
  }

  db.query(
    "INSERT INTO Department (departmentCode, departmentName, grossSalary) VALUES (?, ?, ?)",
    [departmentCode, departmentName, grossSalary],
    (error, results) => {
      if (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ message: "Department code already exists" });
        }
        return res.status(500).json({ message: "Database error", error: error.message });
      }
      return res.status(201).json({ 
        message: "Department created successfully",
        departmentId: results.insertId 
      });
    }
  );
});

app.get("/departments", (req, res) => {
  db.query("SELECT * FROM Department", (error, results) => {
    if (error) {
      return res.status(500).json({ message: "Database error", error: error.message });
    }
    return res.status(200).json(results);
  });
});

// ------------------- Employee -------------------
app.post("/employees", (req, res) => {
  const { 
    employeeNumber, 
    firstName, 
    lastName, 
    position, 
    address, 
    telephone, 
    departmentId 
  } = req.body;

  if (!employeeNumber || !firstName || !lastName || !position || !address || !telephone || !departmentId) {
    return res.status(400).json({ message: "All employee fields are required" });
  }

  db.query(
    "INSERT INTO Employee (employeeNumber, firstName, lastName, position, address, telephone, departmentId) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [employeeNumber, firstName, lastName, position, address, telephone, departmentId],
    (error, results) => {
      if (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ message: "Employee number already exists" });
        }
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
          return res.status(400).json({ message: "Department does not exist" });
        }
        return res.status(500).json({ message: "Database error", error: error.message });
      }
      return res.status(201).json({ 
        message: "Employee created successfully",
        employeeId: results.insertId 
      });
    }
  );
});

app.get("/employees", (req, res) => {
  const query = `
    SELECT e.*, d.departmentName, d.grossSalary 
    FROM Employee e
    JOIN Department d ON e.departmentId = d.id
  `;
  
  db.query(query, (error, results) => {
    if (error) {
      return res.status(500).json({ message: "Database error", error: error.message });
    }
    return res.status(200).json(results);
  });
});

// ------------------- Salary -------------------
app.post("/salaries", (req, res) => {
  const { totalDeduction, netSalary, month, employeeId } = req.body;
  
  if (!totalDeduction || !netSalary || !month || !employeeId) {
    return res.status(400).json({ message: "All salary fields are required" });
  }

  db.query(
    "INSERT INTO Salary (totalDeduction, netSalary, month, employeeId) VALUES (?, ?, ?, ?)",
    [totalDeduction, netSalary, month, employeeId],
    (error, results) => {
      if (error) {
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
          return res.status(400).json({ message: "Employee does not exist" });
        }
        return res.status(500).json({ message: "Database error", error: error.message });
      }
      return res.status(201).json({ 
        message: "Salary created successfully",
        salaryId: results.insertId 
      });
    }
  );
});

app.get("/salaries", (req, res) => {
  const query = `
    SELECT s.*, e.firstName, e.lastName, e.position, d.departmentName
    FROM Salary s
    JOIN Employee e ON s.employeeId = e.id
    JOIN Department d ON e.departmentId = d.id
  `;
  
  db.query(query, (error, results) => {
    if (error) {
      return res.status(500).json({ message: "Database error", error: error.message });
    }
    return res.status(200).json(results);
  });
});

app.put("/salaries/:id", (req, res) => {
  const { id } = req.params;
  const { totalDeduction, netSalary, month } = req.body;
  
  if (!totalDeduction || !netSalary || !month) {
    return res.status(400).json({ message: "All salary fields are required" });
  }

  db.query(
    "UPDATE Salary SET totalDeduction = ?, netSalary = ?, month = ? WHERE id = ?",
    [totalDeduction, netSalary, month, id],
    (error, results) => {
      if (error) {
        return res.status(500).json({ message: "Database error", error: error.message });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Salary record not found" });
      }
      return res.status(200).json({ message: "Salary updated successfully" });
    }
  );
});

app.delete("/salaries/:id", (req, res) => {
  const { id } = req.params;
  
  db.query(
    "DELETE FROM Salary WHERE id = ?",
    [id],
    (error, results) => {
      if (error) {
        return res.status(500).json({ message: "Database error", error: error.message });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Salary record not found" });
      }
      return res.status(200).json({ message: "Salary deleted successfully" });
    }
  );
});

// ------------------- Reports -------------------
app.get("/reports/monthly-payroll", (req, res) => {
  const { month } = req.query;
  
  if (!month) {
    return res.status(400).json({ message: "Month is required" });
  }

  const query = `
    SELECT 
      e.firstName, 
      e.lastName, 
      e.position, 
      d.departmentName,
      s.netSalary,
      s.month
    FROM Salary s
    JOIN Employee e ON s.employeeId = e.id
    JOIN Department d ON e.departmentId = d.id
    WHERE s.month = ?
  `;
  
  db.query(query, [month], (error, results) => {
    if (error) {
      return res.status(500).json({ message: "Database error", error: error.message });
    }
    return res.status(200).json(results);
  });
});


app.listen(3012, (e) => {
  if (e) throw e;
  console.log("Server is running on port 3012");
});
