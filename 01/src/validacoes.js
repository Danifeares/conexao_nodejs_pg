const validarNome = (nome, res) => {
  if (!nome) {
    return res.status(403).json({
      "mensagem": "o campo nome é obrigatório."
    })
  }
}

module.exports = {
  validarNome
}
