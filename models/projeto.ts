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
	aprovado: number;
}

class Projeto {
	private static validar(projeto: Projeto): string {
		if (!projeto)
			return "Projeto inválido";

		projeto.idcliente = parseInt(projeto.idcliente as any);
		if (isNaN(projeto.idcliente))
			return "Cliente inválido";

		projeto.idgestor = parseInt(projeto.idgestor as any);
		if (isNaN(projeto.idgestor))
			return "Gestor inválido";

		projeto.idtecnico = parseInt(projeto.idtecnico as any);
		if (isNaN(projeto.idtecnico))
			return "Técnico inválido";		

		projeto.nome_projeto = (projeto.nome_projeto || "").normalize().trim();
		if (projeto.nome_projeto.length < 3 || projeto.nome_projeto.length > 100)
			return "Nome inválido";

		projeto.ano_inicial = parseInt(projeto.ano_inicial as any);
		if (isNaN(projeto.ano_inicial))
			return "Ano inicial inválido";	

		projeto.semestre_inicial = parseInt(projeto.semestre_inicial as any);
		if (isNaN(projeto.semestre_inicial))
			return "Semestre inicial inválido";

		projeto.ano_final = parseInt(projeto.ano_final as any);
		projeto.semestre_final = parseInt(projeto.semestre_final as any);

		if (isNaN(projeto.ano_final) && isNaN(projeto.semestre_final)) {
			projeto.ano_final = null;
			projeto.semestre_final = null;
		} else {
			if (isNaN(projeto.ano_final))
				return "Ano final inválido";	

			if (isNaN(projeto.semestre_final))
				return "Semestre final inválido";
		}

		projeto.aprovado = parseInt(projeto.aprovado as any);
		if (projeto.aprovado)
			projeto.aprovado = 1;
		else
			projeto.aprovado = 0;

		return null;
	}

	public static listar(): Promise<Projeto[]> {
		return app.sql.connect(async (sql) => {
			return (await sql.query(`
				select p.idprojeto, p.idcliente, p.idgestor, p.idtecnico, p.nome_projeto, p.ano_inicial, p.semestre_inicial, p.ano_final, p.semestre_final, p.aprovado,
				c.nome_cliente,
				g.nome nome_gestor,
				t.nome nome_tecnico
				from projeto p
				inner join cliente c on c.idcliente = p.idcliente
				inner join usuario g on g.id = p.idgestor
				inner join usuario t on t.id = p.idtecnico
			`));
		});
	}

	public static obter(idprojeto: number): Promise<Projeto> {
		return app.sql.connect(async (sql) => {
			const lista: Projeto[] = (await sql.query("select idprojeto, idcliente, idgestor, idtecnico, nome_projeto, ano_inicial, semestre_inicial, ano_final, semestre_final, aprovado from projeto where idprojeto = ?", [idprojeto]));
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
				await sql.query("insert into projeto (idcliente, idgestor, idtecnico, nome_projeto, ano_inicial, semestre_inicial, ano_final, semestre_final, aprovado) values (?, ?, ?, ?, ?, ?, ?, ?, ?)", [projeto.idcliente, projeto.idgestor, projeto.idtecnico, projeto.nome_projeto, projeto.ano_inicial, projeto.semestre_inicial, projeto.ano_final, projeto.semestre_final, projeto.aprovado]);
 				return null;
			} catch (e) {
				if (e.code) {
					switch (e.code) {
						case "ER_NO_REFERENCED_ROW":
						case "ER_NO_REFERENCED_ROW_2":
							return "Cliente, gestor ou técnico não encontrado";
						default:
							throw e;
					}
				} else {
					throw e;
				}
			}
		});
	}

	public static editar(projeto: Projeto): Promise<string> {
		const erro = Projeto.validar(projeto);
		if (erro)
			return Promise.resolve(erro);

		return app.sql.connect(async (sql) => {
			try {
				await sql.query("update projeto set idcliente = ?, idgestor = ?, idtecnico = ?, nome_projeto = ?, ano_inicial = ?, semestre_inicial = ?, ano_final = ?, semestre_final = ?, aprovado = ? where idprojeto = ?", [projeto.idcliente, projeto.idgestor, projeto.idtecnico, projeto.nome_projeto, projeto.ano_inicial, projeto.semestre_inicial, projeto.ano_final, projeto.semestre_final, projeto.aprovado, projeto.idprojeto]);
				return (sql.affectedRows ? null : "Projeto não encontrado");
			} catch (e) {
				if (e.code) {
					switch (e.code) {
						case "ER_NO_REFERENCED_ROW":
						case "ER_NO_REFERENCED_ROW_2":
							return "Cliente, gestor ou técnico não encontrado";
						default:
							throw e;
					}
				} else {
					throw e;
				}
			}
		});
	}

	public static excluir(idprojeto: number): Promise<string> {
		return app.sql.connect(async (sql) => {
			await sql.query("delete from projeto where idprojeto = ?", [idprojeto]);
			return (sql.affectedRows ? null : "Projeto não encontrado");
		});
	}
};

export = Projeto;
