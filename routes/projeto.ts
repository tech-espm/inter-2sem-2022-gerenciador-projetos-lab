
import Projeto from "../models/projeto";
import Usuario from "../models/usuario";
import app = require("teem");



class ProjetoRoute {
	public static async criar(req: app.Request, res: app.Response) {
		let u = await Usuario.cookie(req);
		if (!u || !u.admin)
			res.redirect(app.root + "/acesso");
		else
			res.render("projeto/editar", {
				titulo: "Criar projeto",
				textoSubmit: "Criar",
				usuario: u,
				item: null,
			});
	}

	public static async editar(req: app.Request, res: app.Response) {
		let u = await Usuario.cookie(req);
		if (!u || !u.admin) {
			res.redirect(app.root + "/acesso");
		} else {
			let id = parseInt(req.query["id"] as string);
			let item: Projeto = null;
			if (isNaN(id) || !(item = await Projeto.obter(id)))
				res.render("index/nao-encontrado", {
					layout: "layout-sem-form",
					usuario: u
				});
			else
				res.render("projeto/editar", {
					titulo: "Editar projeto",
					usuario: u,
					item: item,
				});
		}
	}

	public static async listar(req: app.Request, res: app.Response) {
		let u = await Usuario.cookie(req);
		if (!u || !u.admin)
			res.redirect(app.root + "/acesso");
		else
			res.render("projeto/listar", {
				layout: "layout-tabela",
				titulo: "Gerenciar projetos",
				datatables: true,
				projeto: u,
				lista: await Projeto.listar()
			});
	}
}

export = ProjetoRoute;
