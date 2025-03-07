const multer = require("multer");
const path = require("path");
require("dotenv").config();

// Función para procesar el nombre del archivo
function processFileName(filename) {
    // Buscar el patrón que empieza con 19xx o 20xx
    const regex = /(19\d{2}|20\d{2})/;

    // Buscar la extensión del archivo (todo después del último punto)
    const extname = path.extname(filename);

    // Buscar los primeros 4 dígitos y eliminar lo que sigue después (excepto la extensión)
    const match = filename.match(regex);

    if (match) {
        // Si encuentra el patrón, recortar el nombre hasta los 4 dígitos
        filename = filename.substring(0, match.index + 4) + extname;
        console.log(filename);
    }

    // Reemplazar los espacios por guiones
    filename = filename.replace(/[()]/g, "");
    filename = filename.replace(/\s+/g, "-");
    console.log(filename);

    return filename;
}

// Configuración de Multer (Storage)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, process.env.UPLOADS_DIR || "uploads");
    },
    filename: (req, file, cb) => {
        // Usamos la función processFileName para modificar el nombre del archivo
        const newFileName = processFileName(file.originalname);
        cb(null, newFileName);
    },
});

// Configuramos Multer con la configuración de almacenamiento
const upload = multer({ storage });

module.exports = upload;
