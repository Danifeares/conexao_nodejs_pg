const pool = require('../conexao')
const { validarNome } = require('../validacoes')

const cadastrarAutor = async (req, res) => {
  const { nome, idade } = req.body
  try {
    validarNome(nome, res)
    const queryInsert = 'insert into autores (nome, idade) values ($1, $2) returning id;'
    const params = [nome, idade]
    const autorInserido = await pool.query(queryInsert, params)
    const idInserido = autorInserido.rows[0].id
    const resposta = {
      id: idInserido,
      nome,
      idade
    }
    return res.status(201).json(resposta)
  } catch (error) {
    console.log(error.message)
  }
}

const buscarAutor = async (req, res) => {
  const { id } = req.params
  try {
    const queryID = `select 
    autores.id as id_autor,
    autores.nome as nome_do_autor,
    autores.idade as idade_autor,
    livros.id as id_livro,
    livros.nome as nome_livro,
    livros.genero as genero_livro,
    livros.editora as editora_livro,
    TO_CHAR(livros.data_publicacao, 'YYYY-MM-DD') as data_publicacao_livro
    from autores full join livros 
    on autores.id = livros.id_autor 
    where autores.id = $1;`
    const params = [id]
    const autorLocalizado = await pool.query(queryID, params)
    if (autorLocalizado.rows.length === 0) {
      return res.status(404).json({
        "mensagem": "Autor não encontrado"
      })
    }
    const {
      id_autor,
      nome_do_autor,
      idade_autor
    } = autorLocalizado.rows[0]

    let livros = autorLocalizado.rows.map((livro) => ({
      id: livro.id_livro,
      nome: livro.nome_livro,
      genero: livro.genero_livro,
      editora: livro.editora_livro,
      data_publicacao: livro.data_publicacao_livro
    }))

    const resposta = {
      id: id_autor,
      nome: nome_do_autor,
      idade: idade_autor,
      livros: livros
    }

    return res.status(200).json(resposta)
  } catch (error) {
    console.log(error.message)
  }
}

const cadastrarLivro = async (req, res) => {
  const { nome, genero, editora, data_publicacao } = req.body
  const { id } = req.params
  try {
    validarNome(nome, res)
    const queryID = 'select * from autores where id = $1;'
    const paramsID = [id]
    const autorLocalizado = await pool.query(queryID, paramsID)
    if (autorLocalizado.rows.length === 0) {
      return res.status(404).json({
        "mensagem": "Autor não encontrado"
      })
    }
    const queryLivro = `insert into livros (nome, genero, editora, data_publicacao, id_autor)
    values ($1, $2, $3, $4, $5) returning id;`
    const params = [nome, genero, editora, data_publicacao, id]
    const livroCadastrado = await pool.query(queryLivro, params)
    const idInserido = livroCadastrado.rows[0].id
    const resposta = {
      id: idInserido,
      nome,
      genero,
      editora,
      data_publicacao
    }
    return res.status(201).json(resposta)
  } catch (error) {
    console.log(error.message)
  }
}

const listarLivros = async (req, res) => {
  try {   
    const queryLivros = `select 
    autores.id as id_autor,
    autores.nome as nome_do_autor,
    autores.idade as idade_autor,
    livros.id as id_livro,
    livros.nome as nome_livro,
    livros.genero as genero_livro,
    livros.editora as editora_livro,
    to_char(livros.data_publicacao, 'YYYY-MM-DD') as data_publicacao_livro
    from livros join autores 
    on autores.id = livros.id_autor;`
    const livros = await pool.query(queryLivros)
  
    const resposta = livros.rows.map((livro) => ({
      id: livro.id_livro,
      nome: livro.nome_livro,
      genero: livro.genero_livro,
      editora: livro.editora_livro,
      data_publicacao: livro.data_publicacao_livro,
      autor: {
        id: livro.id_autor,
        nome: livro.nome_do_autor,
        idade: livro.idade_autor
      }
    }))
    
    return res.status(200).json(resposta)
  } catch (error) {
    console.log(error.message)
  }
}

module.exports = {
  cadastrarAutor,
  buscarAutor,
  cadastrarLivro,
  listarLivros
}