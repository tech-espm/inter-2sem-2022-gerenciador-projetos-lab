import app = require("teem");
import perfis = require("../models/perfil");
import Cliente = require("../models/Cliente");
import Usuario = require("../models/usuario");

class ClienteRoute {
	public static async criar(req: app.Request, res: app.Response) {
		let u = await Usuario.cookie(req);
		if (!u || !u.admin)
			res.redirect(app.root + "/acesso");
		else
			res.render("cliente/editar", {
				titulo: "Criar Cliente",
				textoSubmit: "Criar",
				usuario: u,
				item: null
			});
	}

	public static async editar(req: app.Request, res: app.Response) {
		let u = await Usuario.cookie(req);
		if (!u || !u.admin) {
			res.redirect(app.root + "/acesso");
		} else {
			let id = parseInt(req.query["id"] as string);
			let item: Cliente = null;
			if (isNaN(id) || !(item = await Cliente.obter(id)))
				res.render("index/nao-encontrado", {
					layout: "layout-sem-form",
					usuario: u
				});
			else
				res.render("cliente/editar", {
					titulo: "Editar Cliente",
					usuario: u,
					item: item
				});
		}
	}

	public static async listar(req: app.Request, res: app.Response) {
		let u = await Usuario.cookie(req);
		if (!u || !u.admin)
			res.redirect(app.root + "/acesso");
		else
			res.render("cliente/listar", {
				layout: "layout-tabela",
				titulo: "Gerenciar Clientes",
				datatables: true,
				usuario: u,
				lista: await Cliente.listar()
			});
	}
}

export = ClienteRoute;
