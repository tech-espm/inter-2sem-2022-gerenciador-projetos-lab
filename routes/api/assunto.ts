import app = require("teem");
import Perfil = require("../../enums/perfil");
import Usuario = require("../../models/usuario");
import Assunto = require("../../models/exemplo-assunto");

class AssuntoApiRoute {
	public static async listar(req: app.Request, res: app.Response) {
		res.json(await Assunto.listar());
	}

	public static async obter(req: app.Request, res: app.Response) {
		const id = parseInt(req.query["id"] as string);

		if (isNaN(id)) {
			res.status(400).json("Id inválido");
			return;
		}

		res.json(await Assunto.obter(id));
	}

	@app.http.post()
	public static async criar(req: app.Request, res: app.Response) {
		const erro = await Assunto.criar(req.body);

		if (erro) {
			res.status(400).json(erro);
			return;
		}

		res.sendStatus(204);
	}

	@app.http.post()
	public static async editar(req: app.Request, res: app.Response) {
		const erro = await Assunto.editar(req.body);

		if (erro) {
			res.status(400).json(erro);
			return;
		}

		res.sendStatus(204);
	}

	@app.http.delete()
	public static async excluir(req: app.Request, res: app.Response) {
		const id = parseInt(req.query["id"] as string);

		if (isNaN(id)) {
			res.status(400).json("Id inválido");
			return;
		}

		const erro = await Usuario.excluir(id);

		if (erro) {
			res.status(400).json(erro);
			return;
		}

		res.sendStatus(204);
	}
}

export = AssuntoApiRoute;
