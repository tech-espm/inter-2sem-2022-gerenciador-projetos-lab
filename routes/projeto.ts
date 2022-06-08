
import app = require("teem");
import Aluno = require("../models/aluno");
import Cliente = require("../models/cliente");
import Projeto = require("../models/projeto");
import Usuario = require("../models/usuario");

class ProjetoRoute {
	public static async criar(req: app.Request, res: app.Response) {
		let u = await Usuario.cookie(req);
		if (!u || !u.admin)
			res.redirect(app.root + "/acesso");
		else
			res.render("projeto/editar", {
				titulo: "Criar Projeto",
				textoSubmit: "Criar",
				usuario: u,
				item: null,
				clientes: await Cliente.listarDropDown(),
				usuarios: await Usuario.listarDropDown(),
				alunos: await Aluno.listar()
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
					titulo: "Editar Projeto",
					usuario: u,
					item: item,
					clientes: await Cliente.listarDropDown(),
					usuarios: await Usuario.listarDropDown(),
					alunos: await Aluno.listar()
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
				titulo: "Gerenciar Projetos",
				datatables: true,
				usuario: u,
				lista: await Projeto.listar()
			});
	}
}

export = ProjetoRoute;
