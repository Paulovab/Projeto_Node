
import { useState, useEffect } from "react";
import "./print.css";

type Item = {
  nome: string;
  preco: number;
  quantidade: number;
};

const produtosDisponiveis = [
  { nome: "Kids", preco: 8 },
  { nome: "Vira-Lata - 1 Salsicha", preco: 10 },
  { nome: "PitBull - 2 Salsicha", preco: 12 },
  { nome: "Hotvaler - 3 Salsicha", preco: 15 },
];

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: "100vh",
    background: "#f4f4f4",
    display: "flex",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    background: "#fff",
    padding: 20,
    borderRadius: 12,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: 500,
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 24,
    color: "#333",
  },
  label: {
    display: "block",
    marginBottom: 6,
    fontWeight: "bold",
    color: "#444",
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: 12,
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    marginBottom: 10,
    fontWeight: "bold",
  },
  buttonClear: {
    width: "100%",
    padding: 12,
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: "bold",
    marginBottom: 10,
  },
  buttonPrint: {
    width: "100%",
    padding: 12,
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: "bold",
  },
  list: {
    listStyle: "none",
    padding: 0,
    marginTop: 10,
    marginBottom: 10,
  },
  listItem: {
    padding: "8px 0",
    borderBottom: "1px solid #ddd",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  total: {
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 10,
    textAlign: "right",
  },
  qtdControls: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  qtdBtn: {
    padding: "4px 8px",
    backgroundColor: "#ccc",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
  },
  removeBtn: {
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    padding: "4px 8px",
    cursor: "pointer",
  }
};

function App() {
  const [itens, setItens] = useState<Item[]>(() => {
    const dadosSalvos = localStorage.getItem("pedidos");
    return dadosSalvos ? JSON.parse(dadosSalvos) : [];
  });

  const [produtoSelecionado, setProdutoSelecionado] = useState(produtosDisponiveis[0]);

  useEffect(() => {
    localStorage.setItem("pedidos", JSON.stringify(itens));
  }, [itens]);

  const total = itens.reduce((acc, item) => acc + item.preco * item.quantidade, 0);

  const adicionarItem = () => {
    const index = itens.findIndex(i => i.nome === produtoSelecionado.nome);
    if (index > -1) {
      const novos = [...itens];
      novos[index].quantidade += 1;
      setItens(novos);
    } else {
      setItens([...itens, { nome: produtoSelecionado.nome, preco: produtoSelecionado.preco, quantidade: 1 }]);
    }
  };

  const alterarQuantidade = (index: number, delta: number) => {
    const novos = [...itens];
    novos[index].quantidade += delta;
    if (novos[index].quantidade < 1) novos[index].quantidade = 1;
    setItens(novos);
  };

  const removerItem = (index: number) => {
    const novos = [...itens];
    novos.splice(index, 1);
    setItens(novos);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Pedidos Hot Dog</h1>

        <label style={styles.label}>Produto:</label>
        <select
          style={styles.input}
          value={produtoSelecionado.nome}
          onChange={(e) => {
            const prod = produtosDisponiveis.find(p => p.nome === e.target.value);
            if (prod) setProdutoSelecionado(prod);
          }}
        >
          {produtosDisponiveis.map((p) => (
            <option key={p.nome} value={p.nome}>
              {p.nome} - R${p.preco.toFixed(2)}
            </option>
          ))}
        </select>

        <button onClick={adicionarItem} style={styles.button}>
          Adicionar Produto
        </button>

        <ul style={styles.list}>
          {itens.map((item, index) => (
            <li key={index} style={styles.listItem}>
              <div>
                {item.nome} - R${(item.preco * item.quantidade).toFixed(2)}
              </div>
              <div style={styles.qtdControls}>
                <button style={styles.qtdBtn} onClick={() => alterarQuantidade(index, -1)}>-</button>
                <span>{item.quantidade}</span>
                <button style={styles.qtdBtn} onClick={() => alterarQuantidade(index, 1)}>+</button>
                <button style={styles.removeBtn} onClick={() => removerItem(index)}>🗑</button>
              </div>
            </li>
          ))}
        </ul>

        <div style={styles.total}>Total: R${total.toFixed(2)}</div>

        <button onClick={() => setItens([])} style={styles.buttonClear}>
          Limpar Pedido
        </button>

        <button onClick={() => window.print()} style={styles.buttonPrint}>
          Imprimir Pedido
        </button>
      </div>
    </div>
  );
}

export default App;
