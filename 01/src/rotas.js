const express = require('express')
const { cadastrarAutor, buscarAutor, cadastrarLivro, listarLivros } = require('./controladores/bibliotecaControladores')
const rotas = express()

rotas.post('/autor', cadastrarAutor)

rotas.get('/autor/:id', buscarAutor)

rotas.post('/autor/:id/livro', cadastrarLivro)

rotas.get('/livro', listarLivros)

module.exports = rotas