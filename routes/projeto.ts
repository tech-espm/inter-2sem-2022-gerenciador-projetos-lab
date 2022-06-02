import app = require("teem");
import perfis = require("../models/perfil");
import Projeto = require("../models/Projeto");

class ProjetoRoute {
	public static async criar(req: app.Request, res: app.Response) {
		let u = await Projeto.cookie(req);
		if (!u || !u.admin)
			res.redirect(app.root + "/acesso");
		else
			res.render("Projeto/editar", {
				titulo: "Criar Usuário",
				textoSubmit: "Criar",
				Projeto: u,
				item: null,
				perfis: perfis.lista
			});
	}

	public static async editar(req: app.Request, res: app.Response) {
		let u = await Projeto.cookie(req);
		if (!u || !u.admin) {
			res.redirect(app.root + "/acesso");
		} else {
			let id = parseInt(req.query["id"] as string);
			let item: Projeto = null;
			if (isNaN(id) || !(item = await Projeto.obter(id)))
				res.render("index/nao-encontrado", {
					layout: "layout-sem-form",
					Projeto: u
				});
			else
				res.render("Projeto/editar", {
					titulo: "Editar Usuário",
					Projeto: u,
					item: item,
					perfis: perfis.lista
				});
		}
	}

	public static async listar(req: app.Request, res: app.Response) {
		let u = await Projeto.cookie(req);
		if (!u || !u.admin)
			res.redirect(app.root + "/acesso");
		else
			res.render("Projeto/listar", {
				layout: "layout-tabela",
				titulo: "Gerenciar Usuários",
				datatables: true,
				Projeto: u,
				lista: await Projeto.listar()
			});
	}
}

export = ProjetoRoute;
