create database biblioteca;

-- 01:
create table autores (
  id serial primary key,
  nome varchar(200) not null,
  idade int
);

-- 04:
create table livros (
  id serial primary key,
  nome varchar(255) not null,
  genero varchar(50),
  editora varchar(100),
  data_publicacao date,
  id_autor int references autores(id)
);