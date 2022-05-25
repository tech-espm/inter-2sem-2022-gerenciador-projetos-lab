import app = require("teem");

interface Projeto {
	idprojeto: number;
	idcliente: number;
	idgestor: number;
	idtecnico: number;
	nome_projeto: string;
	ano_inicial: number;
	semestre_inicial: number;
	ano_final: number;
	semestre_final: number;

}

class Projeto {
	private static validar(projeto: Projeto): string {
		if (!projeto)
			return "Projeto inválido";

		projeto.idcliente = parseInt(projeto.idcliente as any);
		if (isNaN(projeto.idcliente))
			return "Cliente inválido";

		projeto.nome_projeto = (projeto.nome_projeto || "").normalize().trim();
		if (projeto.nome_projeto.length < 3 || projeto.nome_projeto.length > 100)
			return "Nome inválido";

		projeto.idgestor = parseInt(projeto.idgestor as any);
		if (isNaN(projeto.idgestor))
			return "Gestor inválido";

		projeto.idtecnico = parseInt(projeto.idtecnico as any);
		if (isNaN(projeto.idtecnico))
			return "Técnico inválido";		

		projeto.ano_inicial = parseInt(projeto.ano_inicial as any);
		if (isNaN(projeto.ano_inicial))
			return "Ano Inválido";	

		projeto.ano_final = parseInt(projeto.ano_final as any);
		if (isNaN(projeto.ano_final))
			return "Ano Inválido";	

		projeto.semestre_inicial = parseInt(projeto.semestre_inicial as any);
		if (isNaN(projeto.semestre_inicial))
			return "Semestre Inválido";


		projeto.semestre_final = parseInt(projeto.semestre_final as any);
		if (isNaN(projeto.semestre_final))
			return "Semestre Inválido";




		return null;
	}

	public static listar(): Promise<Projeto[]> {
		return app.sql.connect(async (sql) => {
			return (await sql.query("select idprojeto, idcliente, idgestor, idtecnico, nome_projeto, ano_inicial, semestre_inicial, ano_final, semestre_final from projeto order by nome_projeto asc"));
		});
	}

	public static obter(id: number): Promise<Projeto> {
		return app.sql.connect(async (sql) => {
			const lista: Projeto[] = (await sql.query("select id, nome, respostapadrao, date_format(criacao, '%d/%m/%Y') from projeto where id = ?", [id]));
			if (!lista || lista.length === 0) {
				return null;
			}
			return lista[0];
		});
	}

	public static async criar(projeto: Projeto): Promise<string> {
		const erro = Projeto.validar(projeto);
		if (erro)
			return erro;

		return app.sql.connect(async (sql) => {
			try {
				await sql.query("insert into projeto (idcliente, idgestor, idtecnico, nome_projeto, ano_inicial, semestre_inicial, ano_final, semestre_final) values (?, ?, ?, ?, ?, ?, ?, ?)", [projeto.idcliente, projeto.idgestor, projeto.idtecnico, projeto.nome_projeto, projeto.ano_inicial, projeto.semestre_inicial, projeto.ano_final, projeto.semestre_final]);
 				return null;
			} catch (e) {
				if (e.code && e.code === "ER_DUP_ENTRY")
					return `O projeto ${projeto.nome_projeto} ou o id ${projeto.idprojeto} já existe`;
				throw e;
			}
		});
	}

	public static editar(projeto: Projeto): Promise<string> {
		const erro = Projeto.validar(projeto);
		if (erro)
			return Promise.resolve(erro);

		return app.sql.connect(async (sql) => {
			try {
				await sql.query("update projeto set nome = ?, respostapadrao = ? where id = ?", [projeto.nome_projeto, projeto.idprojeto]);
				return (sql.affectedRows ? null : "Projeto não encontrado");
			} catch (e) {
				if (e.code && e.code === "ER_DUP_ENTRY")
					return `O projeto ${projeto.nome_projeto} já existe`;
				throw e;
			}
		});
	}

	public static excluir(id: number): Promise<string> {
		return app.sql.connect(async (sql) => {
			await sql.query("delete from projeto where id = ?", [id]);
			return (sql.affectedRows ? null : "Projeto não encontrado");
		});
	}
};

export = Projeto;
