CREATE DATABASE IF NOT EXISTS controleprojeto DEFAULT CHARACTER SET utf8mb4 DEFAULT COLLATE utf8mb4_0900_ai_ci;
USE controleprojeto;

-- DROP TABLE IF EXISTS perfil;
CREATE TABLE perfil (
  id int NOT NULL,
  nome varchar(50) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY nome_UN (nome)
);

-- Manter sincronizado com enums/perfil.ts e models/perfil.ts
INSERT INTO perfil (id, nome) VALUES (1, 'Administrador'), (2, 'Comum');

-- DROP TABLE IF EXISTS usuario;
CREATE TABLE usuario (
  id int NOT NULL AUTO_INCREMENT,
  email varchar(100) NOT NULL,
  nome varchar(100) NOT NULL,
  idperfil int NOT NULL,
  token char(32) DEFAULT NULL,
  exclusao datetime NULL,
  criacao datetime NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY usuario_email_UN (email),
  KEY usuario_exclusao_IX (exclusao),
  KEY usuario_idperfil_FK_IX (idperfil),
  CONSTRAINT usuario_idperfil_FK FOREIGN KEY (idperfil) REFERENCES perfil (id) ON DELETE RESTRICT ON UPDATE RESTRICT
);

INSERT INTO usuario (email, nome, idperfil, token, criacao) VALUES ('admin@espm.br', 'Administrador', 1, NULL, NOW());

-- DROP TABLE IF EXISTS cliente;
CREATE TABLE IF NOT EXISTS cliente (
  idcliente INT NOT NULL AUTO_INCREMENT,
  nome_cliente VARCHAR(100) NOT NULL,
  telefone_cliente VARCHAR(15) NOT NULL,
  interno TINYINT NOT NULL,
  responsavel varchar(100) NOT NULL, 
  email_cliente varchar(100) NOT NULL,
  PRIMARY KEY (idcliente)
);

-- DROP TABLE IF EXISTS projeto;
CREATE TABLE IF NOT EXISTS projeto (
  idprojeto INT NOT NULL AUTO_INCREMENT,
  idcliente INT NOT NULL,
  idgestor INT NOT NULL,
  idtecnico INT NOT NULL,
  nome_projeto VARCHAR(100) NOT NULL,
  ano_inicial INT NOT NULL,
  semestre_inicial INT NOT NULL,
  ano_final INT NULL,
  semestre_final INT NULL,
  aprovado TINYINT,
  PRIMARY KEY (idprojeto),
  INDEX projeto_idcliente_FK_idx (idcliente ASC),
  INDEX projeto_idgestor_FK_idx (idgestor ASC),
  INDEX projeto_idtecnico_FK_idx (idtecnico ASC),
  CONSTRAINT projeto_idcliente_FK FOREIGN KEY (idcliente) REFERENCES cliente (idcliente) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT projeto_idgestor_FK FOREIGN KEY (idgestor) REFERENCES usuario (id) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT projeto_idtecnico_FK FOREIGN KEY (idtecnico) REFERENCES usuario (id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- DROP TABLE IF EXISTS aluno;
CREATE TABLE IF NOT EXISTS aluno (
  idaluno INT NOT NULL AUTO_INCREMENT,
  nome_aluno VARCHAR(100) NOT NULL,
  ra_aluno INT NOT NULL,
  PRIMARY KEY (idaluno),
  UNIQUE INDEX ra_aluno_UN (ra_aluno ASC)
);

-- DROP TABLE IF EXISTS projeto_aluno;
CREATE TABLE IF NOT EXISTS projeto_aluno (
  idprojetoaluno INT NOT NULL AUTO_INCREMENT,
  idprojeto INT NOT NULL,
  idaluno INT NOT NULL,
  PRIMARY KEY (idprojetoaluno),
  INDEX projeto_aluno_idprojeto_FK_idx (idprojeto ASC),
  INDEX projeto_aluno_idaluno_FK_idx (idaluno ASC),
  CONSTRAINT projeto_aluno_idprojeto_FK FOREIGN KEY (idprojeto) REFERENCES projeto (idprojeto) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT projeto_aluno_idaluno_FK FOREIGN KEY (idaluno) REFERENCES aluno (idaluno) ON DELETE NO ACTION ON UPDATE NO ACTION
);
