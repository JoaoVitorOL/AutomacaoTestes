const Hamburgeria = require("../src/hamburgeria");

describe("Testes da Hamburgeria", () => {
    // =================================
    //     Metodo 1: Cadastro de produto
    // =================================
    test("Cadastro de produto", () => {
        const hamburgeria = new Hamburgeria();

        const produto = hamburgeria.cadastrarProduto("X-burguer", 26);

        expect(produto).toEqual({
            id: 1,
            nome: "X-burguer",
            preco: 26,
            categoria: "hamburguer",
            disponivel: true
        });
    });

    // =================================
    //     Metodo 2: Listar cardapio
    // =================================
    test("Listar cardapio", () => {
        const hamburgeria = new Hamburgeria();
        hamburgeria.cadastrarProduto("X-burguer", 26);
        hamburgeria.cadastrarProduto("X-salada", 28);
        hamburgeria.cadastrarProduto("Macarrao", 90);
        hamburgeria.cadastrarProduto("Vegano", 190);

        const cardapio = hamburgeria.listarCardapio();

        expect(cardapio).toEqual([
            { id: 1, nome: "X-burguer", preco: 26, categoria: "hamburguer", disponivel: true },
            { id: 2, nome: "X-salada", preco: 28, categoria: "hamburguer", disponivel: true },
            { id: 3, nome: "Macarrao", preco: 90, categoria: "hamburguer", disponivel: true },
            { id: 4, nome: "Vegano", preco: 190, categoria: "hamburguer", disponivel: true }
        ]);
    });

    // =================================
    //     Metodo 3: Buscar produto por ID
    // =================================
    test("Buscar produto por ID", () => {
        const hamburgeria = new Hamburgeria();
        hamburgeria.cadastrarProduto("X-burguer", 26);
        hamburgeria.cadastrarProduto("X-salada", 28);
        hamburgeria.cadastrarProduto("Macarrao", 90);
        hamburgeria.cadastrarProduto("Vegano", 190);

        const produto = hamburgeria.buscarProdutoPorId(3);

        expect(produto).toEqual({
            id: 3,
            nome: "Macarrao",
            preco: 90,
            categoria: "hamburguer",
            disponivel: true
        });
    });

    // =================================
    //     Metodo 4: Atualizar Preco
    // =================================
    test("Atualizar Preco", () => {
        const hamburgeria = new Hamburgeria();
        hamburgeria.cadastrarProduto("X-burguer", 26);
        hamburgeria.cadastrarProduto("X-salada", 28);
        hamburgeria.cadastrarProduto("Macarrao", 90);
        hamburgeria.cadastrarProduto("Vegano", 190);

        const preco = hamburgeria.atualizarPreco(3, 300);

        expect(preco).toEqual({
            id: 3,
            nome: "Macarrao",
            preco: 300,
            categoria: "hamburguer",
            disponivel: true
        });
    });

    // =================================
    //     Metodo 5: Alterar disponibilidade
    // =================================
    test("Alterar disponibilidade", () => {
        const hamburgeria = new Hamburgeria();
        hamburgeria.cadastrarProduto("X-burguer", 26);
        hamburgeria.cadastrarProduto("X-salada", 28);
        hamburgeria.cadastrarProduto("Macarrao", 90);
        hamburgeria.cadastrarProduto("Vegano", 190);

        const produto = hamburgeria.alterarDisponibilidade(1, false);

        expect(produto).toEqual({
            id: 1,
            nome: "X-burguer",
            preco: 26,
            categoria: "hamburguer",
            disponivel: false
        });
    });

    // =================================
    //     Metodo 6: Criar pedido
    // =================================
    test("Criar pedido", () => {
        const hamburgeria = new Hamburgeria();
        hamburgeria.cadastrarProduto("X-burguer", 26);

        const pedido = hamburgeria.criarPedido("Roger", "balcao");

        expect(pedido).toEqual({
            id: 1,
            cliente: "Roger",
            tipo: "balcao",
            status: "aberto",
            itens: [],
            cupom: null,
            pagamento: null
        });
    });

    // =================================
    //     Metodo 7: Adicionar item
    // =================================
    test("Adicionar item", () => {
        const hamburgeria = new Hamburgeria();
        hamburgeria.cadastrarProduto("X-burguer", 26);
        hamburgeria.cadastrarProduto("X-salada", 28);
        hamburgeria.criarPedido("Paula", "balcao");
        hamburgeria.criarPedido("Jorge", "balcao");
        hamburgeria.criarPedido("Ana", "entrega");

        const item = hamburgeria.adicionarItem(2, 2, 1, "Ele ama x salada");

        expect(item).toEqual({
            id: 1,
            produtoId: 2,
            nome: "X-salada",
            precoUnitario: 28,
            quantidade: 1,
            observacao: "Ele ama x salada"
        });
    });

    // =================================
    //     Metodo 8: Remover item
    // =================================
    test("Remover item", () => {
        const hamburgeria = new Hamburgeria();
        hamburgeria.cadastrarProduto("X-burguer", 26);
        hamburgeria.criarPedido("Paula", "balcao");
        const item = hamburgeria.adicionarItem(1, 1, 1, "Sem cebola");

        const remove = hamburgeria.removerItem(1, item.id);

        expect(remove).toBe(true);
    });

    // =================================
    //     Metodo 9: Alterar quantidade item
    // =================================
    test("Alterar quantidade item", () => {
        const hamburgeria = new Hamburgeria();
        hamburgeria.cadastrarProduto("X-salada", 28);
        hamburgeria.criarPedido("Jorge", "balcao");
        const itemAdicionado = hamburgeria.adicionarItem(1, 1, 1, "Ele ama x salada");

        const itemAtualizado = hamburgeria.alterarQuantidadeItem(1, itemAdicionado.id, 10);

        expect(itemAtualizado.quantidade).toBe(10);
    });

    // =================================
    //     Metodo 10: Calcular subtotal
    // =================================
    test("Calcular subtotal", () => {
        const hamburgeria = new Hamburgeria();
        hamburgeria.cadastrarProduto("X-burguer", 26);
        hamburgeria.criarPedido("Jorge", "balcao");
        const item = hamburgeria.adicionarItem(1, 1, 1, "Sem molho");
        hamburgeria.alterarQuantidadeItem(1, item.id, 10);

        const subtotal = hamburgeria.calcularSubtotal(1);

        expect(subtotal).toBeCloseTo(260, 2);
    });

    // =================================
    //     Metodo 11 & 12: Cupom e Desconto
    // =================================
    test("Aplicar cupom percentual e calcular desconto", () => {
        const hamburgeria = new Hamburgeria();
        hamburgeria.cadastrarProduto("X-burguer", 30);
        hamburgeria.criarPedido("Lucas", "balcao");
        hamburgeria.adicionarItem(1, 1, 2);

        const cupom = hamburgeria.aplicarCupom(1, "BURGER10");
        const desconto = hamburgeria.calcularDesconto(1);

        expect(cupom.codigo).toBe("BURGER10");
        expect(desconto).toBe(6);
    });

    // =================================
    //     Metodo 13: Taxa de Servico
    // =================================
    test("Calcular taxa de servico", () => {
        const hamburgeria = new Hamburgeria();
        hamburgeria.cadastrarProduto("X-salada", 20);
        hamburgeria.criarPedido("Carlos", "balcao");
        hamburgeria.adicionarItem(1, 1, 2);

        const taxaServico = hamburgeria.calcularTaxaServico(1);

        expect(taxaServico).toBe(4);
    });

    // =================================
    //     Metodo 14: Taxa de Entrega
    // =================================
    test("Calcular taxa de entrega padrão e com cupom frete grátis", () => {
        const hamburgeria = new Hamburgeria();
        hamburgeria.cadastrarProduto("X-burguer", 25);
        hamburgeria.criarPedido("Mariana", "entrega");

        const taxaEntregaNormal = hamburgeria.calcularTaxaEntrega(1);
        hamburgeria.aplicarCupom(1, "FRETEGRATIS");
        const taxaEntregaComCupom = hamburgeria.calcularTaxaEntrega(1);

        expect(taxaEntregaNormal).toBe(7);
        expect(taxaEntregaComCupom).toBe(0);
    });

    // =================================
    //     Metodo 15: Calcular Total
    // =================================
    test("Calcular total do pedido", () => {
        const hamburgeria = new Hamburgeria({ taxaServicoPercentual: 10, taxaEntregaPadrao: 5 });
        hamburgeria.cadastrarProduto("X-burguer", 50);
        hamburgeria.criarPedido("Fernanda", "entrega");
        hamburgeria.adicionarItem(1, 1, 2);
        hamburgeria.aplicarCupom(1, "COMBO5");

        const total = hamburgeria.calcularTotal(1);

        expect(total).toBeCloseTo(109.5, 2);
    });

    // =================================
    //     Metodo 16: Atualizar Status
    // =================================
    test("Atualizar status do pedido", () => {
        const hamburgeria = new Hamburgeria();
        hamburgeria.criarPedido("Beatriz", "balcao");

        const pedidoAtualizado = hamburgeria.atualizarStatusPedido(1, "preparando");

        expect(pedidoAtualizado.status).toBe("preparando");
    });

    // =================================
    //     Metodo 17: Registrar Pagamento
    // =================================
    test("Registrar pagamento com sucesso", () => {
        const hamburgeria = new Hamburgeria();
        hamburgeria.cadastrarProduto("X-burguer", 20);
        hamburgeria.criarPedido("Roberto", "balcao");
        hamburgeria.adicionarItem(1, 1, 1);

        const pagamento = hamburgeria.registrarPagamento(1, "dinheiro", 30);

        expect(pagamento).toEqual({
            formaPagamento: "dinheiro",
            valorPago: 30,
            total: 22,
            troco: 8
        });
    });

    // =================================
    //     Metodo 18: Cancelar Pedido
    // =================================
    test("Cancelar pedido valido com motivo", () => {
        const hamburgeria = new Hamburgeria();
        hamburgeria.criarPedido("Guilherme", "entrega");

        const pedidoCancelado = hamburgeria.cancelarPedido(1, "Cliente desistiu");

        expect(pedidoCancelado.status).toBe("cancelado");
        expect(pedidoCancelado.motivoCancelamento).toBe("Cliente desistiu");
    });

    // =================================
    //     Metodo 19: Listar Pedidos por Status
    // =================================
    test("Listar pedidos por status", () => {
        const hamburgeria = new Hamburgeria();
        hamburgeria.criarPedido("Pedido 1", "balcao");
        hamburgeria.criarPedido("Pedido 2", "balcao");
        hamburgeria.atualizarStatusPedido(1, "preparando");

        const pedidosAbertos = hamburgeria.listarPedidosPorStatus("aberto");
        const pedidosPreparando = hamburgeria.listarPedidosPorStatus("preparando");

        expect(pedidosAbertos.length).toBe(1);
        expect(pedidosPreparando.length).toBe(1);
    });

    // =================================
    //     Metodo 20: Fechar Caixa
    // =================================
    test("Fechar caixa acumulando valores e ticket medio", () => {
        const hamburgeria = new Hamburgeria();
        hamburgeria.cadastrarProduto("X-burguer", 50);

        hamburgeria.criarPedido("Cliente 1", "balcao");
        hamburgeria.adicionarItem(1, 1, 1);
        hamburgeria.registrarPagamento(1, "cartao", 55);

        hamburgeria.criarPedido("Cliente 2", "balcao");
        hamburgeria.cancelarPedido(2, "Erro de digitação");

        const resumoCaixa = hamburgeria.fecharCaixa();

        expect(resumoCaixa).toEqual({
            pedidosPagos: 1,
            pedidosCancelados: 1,
            totalVendido: 55,
            totalItens: 1,
            ticketMedio: 55
        });
    });

    // ==========================================
    // TESTES DE EXCEÇÕES E REGRAS DE NEGÓCIO
    // ==========================================
    test("Lançar erro ao cadastrar produto com preço inválido", () => {
        const hamburgeria = new Hamburgeria();

        expect(() => hamburgeria.cadastrarProduto("Invalido", -5)).toThrow("Preco deve ser maior que zero");
    });

    // ==========================================
    // TESTES DE EXCEÇÕES E REGRAS DE NEGÓCIO
    // ==========================================
    test("Lançar erro ao tentar pagar pedido sem itens", () => {
        const hamburgeria = new Hamburgeria();
        hamburgeria.criarPedido("Vazio", "balcao");

        expect(() => hamburgeria.registrarPagamento(1, "pix", 50)).toThrow("Pedido sem itens nao pode ser pago");
    });
});