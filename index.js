const express = require("express");
const app = express();
const PORT = 5000;
const path = require("path");
const bcrypt = require("bcrypt");
const session = require("express-session");
const flash = require("express-flash");
const upload = require("./src/middlewares/uploadFiles");
const Day14Model = require("./src/models/day14");
const UserModel = require("./src/models/user");

// setup call hbs with sub folder
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "src/views"));

// set serving static file
app.use(express.static(path.join(__dirname, "./src/assets")));
// set serving static file specific
app.use(express.static(path.join(__dirname, "./src/uploads")));

// parsing data
app.use(express.urlencoded({ extended: false }));

// sequalize init
const config = require("./src/config/config.json");
const { Sequelize, QueryTypes } = require("sequelize");
const sequelize = new Sequelize(config.development);

// setup flash
app.use(flash());

// setup session
app.use(
	session({
		cookie: {
			httpOnly: true,
			secure: false,
			maxAge: 1000 * 60 * 60 * 2,
		},
		store: new session.MemoryStore(),
		saveUninitialized: true,
		resave: false,
		secret: "secretValue",
	})
);

// routing
app.get("/", home);
app.get("/blog", blog);
app.post("/blog", upload.single("upload-image"), addBlog);
app.get("/blog-detail/:id", blogDetail);
app.get("/contact", contactMe);
app.get("/delete-blog/:id", deleteBlog);
app.get("/edit-blog/:id", editBlog);
app.post("/update-blog/:id", upload.single("upload-image"), updateBlog);

// login, register, logout
app.get("/register", formRegister);
app.post("/register", addUser);
app.get("/login", formLogin);
app.post("/login", userLogin);
app.get("/logout", logout);

// local server
app.listen(PORT, () => {
	console.log(`Example app listening on port ${PORT}`);
});

// module.exports = app;

// index
async function home(req, res) {
	try {
		let query = `SELECT "Day14s".id, "Day14s".name, start_date, end_date, description, nodejs, reactjs, nextjs, typescript, duration, image, users.name AS author FROM "Day14s" LEFT JOIN users ON "Day14s".author = users.id `;

		if (req.session.isLogin) {
			query += ` WHERE "Day14s".author = ${req.session.idUser}`;
		}

		query += ` ORDER BY "Day14s".id DESC`;

		let obj = await sequelize.query(query, { type: QueryTypes.SELECT });

		const data = obj.map((res) => ({
			...res,
			isLogin: req.session.isLogin,
		}));

		res.render("index", {
			data,
			isLogin: req.session.isLogin,
			user: req.session.user,
		});
	} catch (err) {
		console.log(err);
	}
}

// blog
function blog(req, res) {
	res.render("blog", {
		isLogin: req.session.isLogin,
		user: req.session.user,
	});
}

// add a new blog
async function addBlog(req, res) {
	try {
		const {
			name,
			start_date,
			end_date,
			description,
			nodejs,
			reactjs,
			nextjs,
			typescript,
		} = req.body;
		const image = req.file.filename;
		const author = req.session.idUser;

		let start = new Date(start_date);
		let end = new Date(end_date);

		if (start > end) {
			return console.log("You Fill End Date Before Start Date");
		}

		let difference = end.getTime() - start.getTime();
		let days = difference / (1000 * 3600 * 24);
		let weeks = Math.floor(days / 7);
		let months = Math.floor(weeks / 4);
		let years = Math.floor(months / 12);
		let duration = "";

		if (days > 0) {
			duration = days + " Hari";
		}
		if (weeks > 0) {
			duration = weeks + " Minggu";
		}
		if (months > 0) {
			duration = months + " Bulan";
		}
		if (years > 0) {
			duration = years + " Tahun";
		}

		// Mengubah nilai string kosong menjadi false jika checkbox tidak dipilih
		const nodejsValue = nodejs === "true" ? true : false;
		const reactjsValue = reactjs === "true" ? true : false;
		const nextjsValue = nextjs === "true" ? true : false;
		const typescriptValue = typescript === "true" ? true : false;

		await sequelize.query(
			`INSERT INTO "Day14s" (name, start_date, end_date, description, nodejs, reactjs, nextjs, typescript, image, duration, author) VALUES ('${name}','${start_date}','${end_date}','${description}',${nodejsValue},${reactjsValue},${nextjsValue},${typescriptValue},'${image}', '${duration}', ${author})`
		);

		res.redirect("/");
	} catch (err) {
		console.log(err);
	}
}

// edit blog
async function editBlog(req, res) {
	try {
		const id = parseInt(req.params.id);
		const query = `SELECT * FROM "Day14s" WHERE id=${id}`;
		const obj = await sequelize.query(query, {
			type: QueryTypes.SELECT,
		});
		res.render("edit-blog", { blog: obj[0], blogIndex: id });
	} catch (err) {
		console.log(err);
	}
}

// update blog
async function updateBlog(req, res) {
	try {
		const { id } = req.params;
		const {
			name,
			start_date,
			end_date,
			description,
			nodejs,
			reactjs,
			nextjs,
			typescript,
		} = req.body;
		const image = req.file.filename;
		const author = req.session.idUser;

		let start = new Date(start_date);
		let end = new Date(end_date);

		if (start > end) {
			return console.log("You Fill End Date Before Start Date");
		}

		let difference = end.getTime() - start.getTime();
		let days = difference / (1000 * 3600 * 24);
		let weeks = Math.floor(days / 7);
		let months = Math.floor(weeks / 4);
		let years = Math.floor(months / 12);
		let duration = "";

		if (days > 0) {
			duration = days + " Hari";
		}
		if (weeks > 0) {
			duration = weeks + " Minggu";
		}
		if (months > 0) {
			duration = months + " Bulan";
		}
		if (years > 0) {
			duration = years + " Tahun";
		}

		// Mengubah nilai string kosong menjadi false jika checkbox tidak dipilih
		const nodejsValue = nodejs === "true" ? true : false;
		const reactjsValue = reactjs === "true" ? true : false;
		const nextjsValue = nextjs === "true" ? true : false;
		const typescriptValue = typescript === "true" ? true : false;

		await sequelize.query(
			`UPDATE public."Day14s" SET name='${name}', start_date='${start_date}', end_date='${end_date}', description='${description}', nodejs=${nodejsValue}, reactjs=${reactjsValue}, nextjs=${nextjsValue}, typescript=${typescriptValue}, duration='${duration}', image='${image}', author=${author} WHERE id=${id};`,
			{
				type: sequelize.QueryTypes.UPDATE,
			}
		);

		res.redirect("/");
	} catch (err) {
		console.log(err);
	}
}

// blog detail
async function blogDetail(req, res) {
	try {
		// const { id } = req.params;
		// console.log(id);
		const idParam = req.params.id;
		const blogId = parseInt(idParam);

		if (!Number.isInteger(blogId)) {
			// Tangani kesalahan jika ID tidak valid
			res.status(400).json({ error: "ID tidak valid" });
			return;
		}

		const query = `SELECT "Day14s".id, "Day14s".name, start_date, end_date, description, nodejs, reactjs, nextjs, typescript, duration, image, users.name AS author FROM "Day14s" LEFT JOIN users ON "Day14s".author = users.id WHERE "Day14s".id = ${blogId}`;
		const obj = await sequelize.query(query, {
			type: QueryTypes.SELECT,
			replacements: { blogId: blogId },
		});
		console.log(obj);
		const data = obj.map((res) => ({
			...res,
		}));

		res.render("blog-detail", {
			blog: data[0],
			isLogin: req.session.isLogin,
			user: req.session.user,
		});
	} catch (err) {
		console.log(err);
	}
}

// contact me
function contactMe(req, res) {
	res.render("contact", {
		isLogin: req.session.isLogin,
		user: req.session.user,
	});
}

// Delete blog
async function deleteBlog(req, res) {
	try {
		const { id } = req.params;

		await sequelize.query(`DELETE FROM "Day14s" WHERE id = ${id};`);
		res.redirect("/");
	} catch (err) {
		console.log(err);
	}
}

function formRegister(req, res) {
	res.render("register");
}

async function addUser(req, res) {
	try {
		const { name, email, password } = req.body;
		const salt = 10;

		await bcrypt.hash(password, salt, (err, hashPassword) => {
			const query = `INSERT INTO users (name, email, password, "createdAt", "updatedAt") VALUES ('${name}', '${email}', '${hashPassword}', NOW(), NOW())`;
			sequelize.query(query);
			res.redirect("login");
		});
	} catch (err) {
		console.log(err);
	}
}

function formLogin(req, res) {
	res.render("login");
}

async function userLogin(req, res) {
	try {
		const { email, password } = req.body;
		const query = `SELECT * FROM users WHERE email = '${email}'`;
		let obj = await sequelize.query(query, { type: QueryTypes.SELECT });

		console.log(obj);

		// cek jika email belum teradaftar
		if (!obj.length) {
			req.flash("danger", "daftar dulu cok!");
			return res.redirect("/login");
		}

		await bcrypt.compare(password, obj[0].password, (err, result) => {
			if (!result) {
				req.flash("danger", "passwordnya salah!");
				return res.redirect("login");
			} else {
				req.session.isLogin = true;
				req.session.idUser = obj[0].id;
				req.session.user = obj[0].name;
				req.flash("success", "Login berhasil");
				res.redirect("/");
			}
		});
	} catch (err) {
		console.log(err);
	}
}

function logout(req, res) {
	if (req.session.isLogin) {
		req.session.destroy((err) => {
			if (err) {
				console.log(err);
			} else {
				res.redirect("/login");
			}
		});
	} else {
		res.redirect("/login");
	}
}
