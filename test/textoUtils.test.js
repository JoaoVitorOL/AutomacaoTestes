const TextoUtils = require("../src/textoUtils");

describe("texto utils", () => {
  test("deve inverter o texto informado", () => {
    // Arrange
    const textoUtils = new TextoUtils();
    const texto = "Jest";

    // Act
    const resultado = textoUtils.inverter(texto);

    // Assert
    expect(resultado).toBe("tseJ");
  });

  test("deve identificar quando o texto e palindromo", () => {
    // Arrange
    const textoUtils = new TextoUtils();
    const texto = "Ame a ema";

    // Act
    const resultado = textoUtils.ehPalindromo(texto);

    // Assert
    expect(resultado).toBe(true);
  });

  test("deve identificar quando o texto nao e palindromo", () => {
    // Arrange
    const textoUtils = new TextoUtils();
    const texto = "teste";

    // Act
    const resultado = textoUtils.ehPalindromo(texto);

    // Assert
    expect(resultado).toBe(false);
  });

  test("deve capitalizar a primeira letra de cada palavra", () => {
    // Arrange
    const textoUtils = new TextoUtils();
    const texto = "joAO da SILVA";

    // Act
    const resultado = textoUtils.capitalizar(texto);

    // Assert
    expect(resultado).toBe("Joao Da Silva");
  });

  test("deve manter espacos duplicados ao capitalizar texto", () => {
    // Arrange
    const textoUtils = new TextoUtils();
    const texto = "ana  maria";

    // Act
    const resultado = textoUtils.capitalizar(texto);

    // Assert
    expect(resultado).toBe("Ana  Maria");
  });

  test("deve contar ocorrencias de uma substring", () => {
    // Arrange
    const textoUtils = new TextoUtils();
    const texto = "banana";
    const substring = "na";

    // Act
    const resultado = textoUtils.contarOcorrencias(texto, substring);

    // Assert
    expect(resultado).toBe(2);
  });

  test("deve retornar zero ao contar ocorrencias de substring vazia", () => {
    // Arrange
    const textoUtils = new TextoUtils();
    const texto = "banana";
    const substring = "";

    // Act
    const resultado = textoUtils.contarOcorrencias(texto, substring);

    // Assert
    expect(resultado).toBe(0);
  });

  test("deve remover espacos extras do texto", () => {
    // Arrange
    const textoUtils = new TextoUtils();
    const texto = "  ola    mundo  ";

    // Act
    const resultado = textoUtils.removerEspacosExtras(texto);

    // Assert
    expect(resultado).toBe("ola mundo");
  });

  test("deve converter texto para slug", () => {
    // Arrange
    const textoUtils = new TextoUtils();
    const texto = "Ol\u00e1, Mundo JS!";

    // Act
    const resultado = textoUtils.paraSlug(texto);

    // Assert
    expect(resultado).toBe("ola-mundo-js");
  });

  test("deve truncar texto maior que o tamanho informado", () => {
    // Arrange
    const textoUtils = new TextoUtils();
    const texto = "Teste unitario";
    const tamanho = 5;

    // Act
    const resultado = textoUtils.truncar(texto, tamanho);

    // Assert
    expect(resultado).toBe("Teste...");
  });

  test("deve manter texto quando o tamanho for suficiente", () => {
    // Arrange
    const textoUtils = new TextoUtils();
    const texto = "Teste";
    const tamanho = 10;

    // Act
    const resultado = textoUtils.truncar(texto, tamanho);

    // Assert
    expect(resultado).toBe("Teste");
  });

  test("deve lancar erro ao truncar com tamanho negativo", () => {
    // Arrange
    const textoUtils = new TextoUtils();
    const texto = "Teste";
    const tamanho = -1;

    // Act
    const acao = () => textoUtils.truncar(texto, tamanho);

    // Assert
    expect(acao).toThrow("O tamanho");
  });

  test("deve contar palavras do texto", () => {
    // Arrange
    const textoUtils = new TextoUtils();
    const texto = "  um   dois tres  ";

    // Act
    const resultado = textoUtils.contarPalavras(texto);

    // Assert
    expect(resultado).toBe(3);
  });

  test("deve validar textos formados apenas por letras", () => {
    // Arrange
    const textoUtils = new TextoUtils();
    const textoValido = "Maria";
    const textoInvalido = "Maria123";

    // Act
    const valido = textoUtils.somenteLetras(textoValido);
    const invalido = textoUtils.somenteLetras(textoInvalido);

    // Assert
    expect(valido).toBe(true);
    expect(invalido).toBe(false);
  });

  test("deve substituir todas as ocorrencias de uma substring", () => {
    // Arrange
    const textoUtils = new TextoUtils();
    const texto = "banana";
    const alvo = "a";
    const substituto = "o";

    // Act
    const resultado = textoUtils.substituirTudo(texto, alvo, substituto);

    // Assert
    expect(resultado).toBe("bonono");
  });

  test("deve lancar erro ao substituir alvo vazio", () => {
    // Arrange
    const textoUtils = new TextoUtils();
    const texto = "banana";
    const alvo = "";
    const substituto = "o";

    // Act
    const acao = () => textoUtils.substituirTudo(texto, alvo, substituto);

    // Assert
    expect(acao).toThrow("O alvo");
  });
});
