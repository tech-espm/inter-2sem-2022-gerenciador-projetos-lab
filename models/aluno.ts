import app = require("teem");

interface Aluno {
	idaluno: number;
	nome_aluno: string;
	ra_aluno: number;
}

class Aluno {
	private static validar(aluno: Aluno): string {
		if (!aluno)
			return "Aluno inválido";

		aluno.nome_aluno = (aluno.nome_aluno || "").normalize().trim();
		if (aluno.nome_aluno.length < 3 || aluno.nome_aluno.length > 100)
			return "Nome aluno inválido";

		aluno.ra_aluno = parseInt(aluno.ra_aluno as any);
		if (isNaN(aluno.ra_aluno))
			return "RA aluno inválido";

		return null;
	}

	public static listar(): Promise<Aluno[]> {
		return app.sql.connect(async (sql) => {
			return (await sql.query("select idaluno, nome_aluno, ra_aluno from aluno"));
		});
	}

	public static obter(id: number): Promise<Aluno> {
		return app.sql.connect(async (sql) => {
			const lista: Aluno[] = (await sql.query("select idaluno, nome_aluno, ra_aluno from aluno where idaluno = ?", [id]));
			if (!lista || lista.length === 0) {
				return null;
			}
			return lista[0];
		});
	}

	public static async criar(aluno: Aluno): Promise<string> {
		const erro = Aluno.validar(aluno);
		if (erro)
			return erro;

		return app.sql.connect(async (sql) => {
			try {
				await sql.query("insert into aluno (nome_aluno, ra_aluno) values (?, ?)", [aluno.nome_aluno, aluno.ra_aluno]);
 				return null;
			} catch (e) {
				if (e.code && e.code === "ER_DUP_ENTRY")
					return `O aluno ${aluno.ra_aluno} já existe`;
				throw e;
			}
		});
	}

	public static editar(aluno: Aluno): Promise<string> {
		const erro = Aluno.validar(aluno);
		if (erro)
			return Promise.resolve(erro);

		return app.sql.connect(async (sql) => {
			try {
				await sql.query("update aluno set nome_aluno = ?, ra_aluno = ? where idaluno = ?", [aluno.nome_aluno, aluno.ra_aluno, aluno.idaluno]);
				return (sql.affectedRows ? null : "Aluno não encontrado");
			} catch (e) {
				if (e.code && e.code === "ER_DUP_ENTRY")
					return `O aluno ${aluno.ra_aluno} já existe`;
				throw e;
			}
		});
	}

	public static excluir(id: number): Promise<string> {
		return app.sql.connect(async (sql) => {
			await sql.query("delete from aluno where idaluno = ?", [id]);
			return (sql.affectedRows ? null : "Aluno não encontrado");
		});
	}
};

export = Aluno;
