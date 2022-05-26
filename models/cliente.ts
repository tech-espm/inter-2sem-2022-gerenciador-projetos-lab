import app = require("teem");
import Validacao = require("../utils/validacao");

interface Cliente {
	idcliente: number; 
	nome_cliente: string; 
	telefone_cliente: string; 
	responsavel: string; 
	email_cliente: string; 
	interno: number;
}

class Cliente {
	private static validar(cliente: Cliente): string {
		if (!cliente)
			return "Cliente inválido";

		cliente.nome_cliente = (cliente.nome_cliente || "").normalize().trim();
		if (cliente.nome_cliente.length < 3 || cliente.nome_cliente.length > 100)
			return "Nome inválido";

		cliente.telefone_cliente = (cliente.telefone_cliente || "").normalize().trim();
		if (cliente.telefone_cliente.length < 14 || cliente.telefone_cliente.length > 15)
			return "Telefone inválido";

		cliente.interno = parseInt(cliente.interno as any);
		if (cliente.interno)
			cliente.interno = 1;
		else
			cliente.interno = 0;

		cliente.responsavel = (cliente.responsavel || "").normalize().trim();
		if (cliente.responsavel.length < 3 || cliente.responsavel.length > 100)
			return "Responsável inválido";

		cliente.email_cliente = (cliente.email_cliente || "").normalize().trim();
		if (cliente.email_cliente.length < 3 || cliente.email_cliente.length > 100 || !Validacao.isEmail(cliente.email_cliente))
			return "Email inválido";

		return null;
	}

	public static listar(): Promise<Cliente[]> {
		return app.sql.connect(async (sql) => {
			return (await sql.query("select idcliente, nome_cliente, telefone_cliente, responsavel, email_cliente, interno from cliente"));
		});
	}

	public static obter(id: number): Promise<Cliente> {
		return app.sql.connect(async (sql) => {
			const lista: Cliente[] = (await sql.query("select idcliente, nome_cliente, telefone_cliente, responsavel, email_cliente, interno from cliente where id = ?", [id]));
			if (!lista || lista.length === 0) {
				return null;
			}
			return lista[0];
		});
	}

	public static async criar(cliente: Cliente): Promise<string> {
		const erro = Cliente.validar(cliente);
		if (erro)
			return erro;

		return app.sql.connect(async (sql) => {
			await sql.query("insert into cliente (nome_cliente, telefone_cliente, responsavel, email_cliente, interno) values (?, ?, ?, ?, ?)", [cliente.nome_cliente, cliente.telefone_cliente, cliente.responsavel, cliente.email_cliente, cliente.interno]);
			return null;
		});
	}

	public static editar(cliente: Cliente): Promise<string> {
		const erro = Cliente.validar(cliente);
		if (erro)
			return Promise.resolve(erro);

		return app.sql.connect(async (sql) => {
			await sql.query("update cliente set nome_cliente = ?, telefone_cliente = ?, responsavel = ?, email_cliente = ?, interno = ? where idcliente = ?", [cliente.nome_cliente, cliente.telefone_cliente, cliente.responsavel, cliente.email_cliente, cliente.interno, cliente.idcliente]);
			return (sql.affectedRows ? null : "Cliente não encontrado");
		});
	}

	public static excluir(id: number): Promise<string> {
		return app.sql.connect(async (sql) => {
			await sql.query("delete from cliente where idcliente = ?", [id]);
			return (sql.affectedRows ? null : "Cliente não encontrado");
		});
	}
};

export = Cliente;

