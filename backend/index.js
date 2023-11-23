const express = require('express');
var mysql = require('mysql');
var config = require('./db-config.json');

const backend = express();
const port = 3000;

var db = mysql.createConnection({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database
});

db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  } else {
    console.log('Conectado ao banco de dados MySQL');
    createTable();
    insertData();
  }
});

const createTable = () => {
  const sql = 'CREATE TABLE IF NOT EXISTS people (id INT AUTO_INCREMENT PRIMARY KEY, nome VARCHAR(255))';
  db.query(sql, (err, resultado) => {
    if (err) throw err;
    console.log('Tabela criada ou já existente');
  });
};

const insertData = () => {
  const nomes = ['Wesley', 'Luiz', 'Lucia'];
  nomes.forEach((nome) => {
    const sql = `INSERT INTO people (nome) VALUES ('${nome}')`;
    db.query(sql, (err, resultado) => {
      if (err) throw err;
      console.log(`${nome} inserido no banco de dados`);
    });
  });
};

backend.get('/', (req, res) => {
  const sql = 'SELECT * FROM people';
  db.query(sql, (err, sqlresults) => {
    if (err) {
      throw err;
    } else {
      const textoHtml = '<h1>Full Cycle Rocks!!</h1>';
      const textoJson = sqlresults;
      res.send(textoHtml + JSON.stringify(textoJson));
    }
  });
});

backend.get('/deleta', (req, res) => {
  const sql = 'DROP TABLE people;';
  db.query(sql, (err, resultado) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(resultado);
    }
  });
});


backend.listen(port, () => {
  //console.log(`Aplicação está em execução na URL http://localhost:${port}`);
});
