class Hamburgeria {
  constructor(configuracao = {}) {
    this.taxaServicoPercentual = configuracao.taxaServicoPercentual ?? 10;
    this.taxaEntregaPadrao = configuracao.taxaEntregaPadrao ?? 7;
    this.produtos = [];
    this.pedidos = [];
    this.proximoProdutoId = 1;
    this.proximoPedidoId = 1;
    this.proximoItemId = 1;
    this.cupons = {
      BURGER10: { tipo: "percentual", valor: 10 },
      COMBO5: { tipo: "fixo", valor: 5 },
      FRETEGRATIS: { tipo: "entrega", valor: 100 },
    };
  }

  // =================================
  //     Metodo 1
  // ========================
  cadastrarProduto(nome, preco, categoria = "hamburguer") {
    if (!nome || typeof nome !== "string") {
      throw new Error("Produto deve ter nome");
    }

    this.#validarPreco(preco);

    const produto = {
      id: this.proximoProdutoId,
      nome: nome.trim(),
      preco,
      categoria,
      disponivel: true,
    };

    this.proximoProdutoId += 1;
    this.produtos.push(produto);

    return this.#copiar(produto);
  }

  // =================================
  //     Metodo 2
  // ========================
  listarCardapio(apenasDisponiveis = false) {
    return this.produtos
      .filter((produto) => !apenasDisponiveis || produto.disponivel)
      .map((produto) => this.#copiar(produto));
  }

  // =================================
  //     Metodo 3
  // ========================
  buscarProdutoPorId(produtoId) {
    const produto = this.produtos.find((item) => item.id === produtoId);
    return produto ? this.#copiar(produto) : null;
  }

  // =================================
  //     Metodo 4
  // ========================
  atualizarPreco(produtoId, novoPreco) {
    const produto = this.#obterProduto(produtoId);
    this.#validarPreco(novoPreco);
    produto.preco = novoPreco;

    return this.#copiar(produto);
  }

  // =================================
  //     Metodo 5
  // ========================
  alterarDisponibilidade(produtoId, disponivel) {
    const produto = this.#obterProduto(produtoId);

    if (typeof disponivel !== "boolean") {
      throw new Error("Disponibilidade deve ser booleana");
    }

    produto.disponivel = disponivel;
    return this.#copiar(produto);
  }

  // =================================
  //     Metodo 6
  // ========================
  criarPedido(cliente, tipo = "balcao") {
    if (!cliente || typeof cliente !== "string") {
      throw new Error("Pedido deve ter cliente");
    }

    if (!["balcao", "entrega"].includes(tipo)) {
      throw new Error("Tipo deve ser balcao ou entrega");
    }

    const pedido = {
      id: this.proximoPedidoId,
      cliente: cliente.trim(),
      tipo,
      status: "aberto",
      itens: [],
      cupom: null,
      pagamento: null,
    };

    this.proximoPedidoId += 1;
    this.pedidos.push(pedido);

    return this.#copiar(pedido);
  }

  // =================================
  //     Metodo 7
  // ========================
  adicionarItem(pedidoId, produtoId, quantidade = 1, observacao = "") {
    const pedido = this.#obterPedido(pedidoId);
    const produto = this.#obterProduto(produtoId);
    this.#exigirPedidoEditavel(pedido);

    if (!produto.disponivel) {
      throw new Error("Produto indisponivel");
    }

    if (!Number.isInteger(quantidade) || quantidade <= 0) {
      throw new Error("Quantidade deve ser um inteiro positivo");
    }

    const item = {
      id: this.proximoItemId,
      produtoId,
      nome: produto.nome,
      precoUnitario: produto.preco,
      quantidade,
      observacao,
    };

    this.proximoItemId += 1;
    pedido.itens.push(item);

    return this.#copiar(item);
  }

  // =================================
  //     Metodo 8
  // ========================
  removerItem(pedidoId, itemId) {
    const pedido = this.#obterPedido(pedidoId);
    this.#exigirPedidoEditavel(pedido);

    const indiceItem = pedido.itens.findIndex((item) => item.id === itemId);

    if (indiceItem === -1) {
      return false;
    }

    pedido.itens.splice(indiceItem, 1);
    return true;
  }

  // =================================
  //     Metodo 9
  // ========================
  alterarQuantidadeItem(pedidoId, itemId, quantidade) {
    const pedido = this.#obterPedido(pedidoId);
    this.#exigirPedidoEditavel(pedido);

    if (!Number.isInteger(quantidade) || quantidade <= 0) {
      throw new Error("Quantidade deve ser um inteiro positivo");
    }

    const item = pedido.itens.find((pedidoItem) => pedidoItem.id === itemId);

    if (!item) {
      throw new Error("Item nao encontrado");
    }

    item.quantidade = quantidade;
    return this.#copiar(item);
  }

  // =================================
  //     Metodo 10
  // ========================
  calcularSubtotal(pedidoId) {
    const pedido = this.#obterPedido(pedidoId);
    return pedido.itens.reduce((total, item) => total + item.precoUnitario * item.quantidade, 0);
  }

  // =================================
  //     Metodo 11
  // ========================
  aplicarCupom(pedidoId, codigo) {
    const pedido = this.#obterPedido(pedidoId);
    this.#exigirPedidoEditavel(pedido);

    const cupom = this.cupons[String(codigo).toUpperCase()];

    if (!cupom) {
      throw new Error("Cupom invalido");
    }

    pedido.cupom = {
      codigo: String(codigo).toUpperCase(),
      tipo: cupom.tipo,
      valor: cupom.valor,
    };

    return this.#copiar(pedido.cupom);
  }

  // =================================
  //     Metodo 12
  // ========================
  calcularDesconto(pedidoId) {
    const pedido = this.#obterPedido(pedidoId);
    const subtotal = this.calcularSubtotal(pedidoId);

    if (!pedido.cupom) {
      return 0;
    }

    if (pedido.cupom.tipo === "percentual") {
      return subtotal * (pedido.cupom.valor / 100);
    }

    if (pedido.cupom.tipo === "fixo") {
      return Math.min(subtotal, pedido.cupom.valor);
    }

    return 0;
  }

  // =================================
  //     Metodo 13
  // ========================
  calcularTaxaServico(pedidoId) {
    const subtotalComDesconto = this.calcularSubtotal(pedidoId) - this.calcularDesconto(pedidoId);
    return subtotalComDesconto * (this.taxaServicoPercentual / 100);
  }

  // =================================
  //     Metodo 14
  // ========================
  calcularTaxaEntrega(pedidoId) {
    const pedido = this.#obterPedido(pedidoId);

    if (pedido.tipo !== "entrega") {
      return 0;
    }

    if (pedido.cupom && pedido.cupom.tipo === "entrega") {
      return 0;
    }

    return this.taxaEntregaPadrao;
  }

  // =================================
  //     Metodo 15
  // ========================
  calcularTotal(pedidoId) {
    const subtotal = this.calcularSubtotal(pedidoId);
    const desconto = this.calcularDesconto(pedidoId);
    const taxaServico = this.calcularTaxaServico(pedidoId);
    const taxaEntrega = this.calcularTaxaEntrega(pedidoId);

    return subtotal - desconto + taxaServico + taxaEntrega;
  }

  // =================================
  //     Metodo 16
  // ========================
  atualizarStatusPedido(pedidoId, status) {
    const pedido = this.#obterPedido(pedidoId);

    if (!["aberto", "preparando", "pronto", "entregue", "cancelado"].includes(status)) {
      throw new Error("Status invalido");
    }

    if (pedido.status === "cancelado" || pedido.status === "entregue") {
      throw new Error("Pedido finalizado nao pode mudar de status");
    }

    pedido.status = status;
    return this.#copiar(pedido);
  }

  // =================================
  //     Metodo 17
  // ========================
  registrarPagamento(pedidoId, formaPagamento, valorPago) {
    const pedido = this.#obterPedido(pedidoId);

    if (pedido.status === "cancelado") {
      throw new Error("Pedido cancelado nao pode ser pago");
    }

    if (pedido.pagamento) {
      throw new Error("Pedido ja possui pagamento registrado");
    }

    if (pedido.itens.length === 0) {
      throw new Error("Pedido sem itens nao pode ser pago");
    }

    if (!formaPagamento || typeof formaPagamento !== "string") {
      throw new Error("Forma de pagamento deve ser informada");
    }

    const total = this.calcularTotal(pedidoId);

    if (typeof valorPago !== "number" || valorPago < total) {
      throw new Error("Valor pago insuficiente");
    }

    pedido.pagamento = {
      formaPagamento,
      valorPago,
      total,
      troco: valorPago - total,
    };

    return this.#copiar(pedido.pagamento);
  }

  // =================================
  //     Metodo 18
  // ========================
  cancelarPedido(pedidoId, motivo = "") {
    const pedido = this.#obterPedido(pedidoId);

    if (pedido.status === "entregue") {
      throw new Error("Pedido entregue nao pode ser cancelado");
    }

    if (pedido.pagamento) {
      throw new Error("Pedido pago nao pode ser cancelado");
    }

    pedido.status = "cancelado";
    pedido.motivoCancelamento = motivo;

    return this.#copiar(pedido);
  }

  // =================================
  //     Metodo 19
  // ========================
  listarPedidosPorStatus(status) {
    if (!["aberto", "preparando", "pronto", "entregue", "cancelado"].includes(status)) {
      throw new Error("Status invalido");
    }

    return this.pedidos
      .filter((pedido) => pedido.status === status)
      .map((pedido) => this.#copiar(pedido));
  }

  // =================================
  //     Metodo 20
  // ========================
  fecharCaixa() {
    const pedidosPagos = this.pedidos.filter((pedido) => pedido.pagamento);
    const totalVendido = pedidosPagos.reduce((total, pedido) => total + pedido.pagamento.total, 0);
    const totalItens = pedidosPagos.reduce(
      (total, pedido) => total + pedido.itens.reduce((soma, item) => soma + item.quantidade, 0),
      0,
    );

    return {
      pedidosPagos: pedidosPagos.length,
      pedidosCancelados: this.pedidos.filter((pedido) => pedido.status === "cancelado").length,
      totalVendido,
      totalItens,
      ticketMedio: pedidosPagos.length === 0 ? 0 : totalVendido / pedidosPagos.length,
    };
  }

  #obterProduto(produtoId) {
    const produto = this.produtos.find((item) => item.id === produtoId);

    if (!produto) {
      throw new Error("Produto nao encontrado");
    }

    return produto;
  }

  #obterPedido(pedidoId) {
    const pedido = this.pedidos.find((item) => item.id === pedidoId);

    if (!pedido) {
      throw new Error("Pedido nao encontrado");
    }

    return pedido;
  }

  #validarPreco(preco) {
    if (typeof preco !== "number" || Number.isNaN(preco) || preco <= 0) {
      throw new Error("Preco deve ser maior que zero");
    }
  }

  #exigirPedidoEditavel(pedido) {
    if (!["aberto", "preparando"].includes(pedido.status)) {
      throw new Error("Pedido nao pode ser editado neste status");
    }
  }

  #copiar(valor) {
    return JSON.parse(JSON.stringify(valor));
  }
}

module.exports = Hamburgeria;
