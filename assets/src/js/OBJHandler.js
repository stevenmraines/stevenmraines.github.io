class OBJHandler {

    async createFile(path, filename, type) {
        let response = await fetch(path);
        let data = await response.blob();
        return new File([data], filename, { type });
    }

    readOBJFile(file) {
        let vert_data = {};
        let face_data = { "vertices": {}, "uvs": {} };
        let uv_data = {};
        let mtl_filenames = [];

        const reader = new FileReader();

        reader.onload = () => {
            let vert_index = 0;
            let face_index = 0;
            let uv_index = 0;
            const lines = reader.result.split('\n');

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();

                if (! line) {
                    continue;
                }

                if (line.startsWith('mtllib ')) {
                    mtl_filenames.push(line.split(' ').slice(1));
                }

                if (line.startsWith('v ')) {
                    vert_index++;
                    let [x, y, z] = line.split(' ').slice(1).map(parseFloat);
                    vert_data[vert_index] = [x,y,z];
                }

                if (line.startsWith('f ')) {
                    face_index++;
                    face_data.vertices[face_index] = line.split(' ')
                        .slice(1)
                        .map((value) => {
                            return value.split('/').slice(0,1).map(parseFloat)[0];
                        });
                    face_data.uvs[face_index] = line.split(' ')
                        .slice(1)
                        .map((value) => {
                            return value.split('/').slice(1,2).map(parseFloat)[0];
                        });
                }

                if (line.startsWith('vt ')) {
                    uv_index++;
                    let [u,v] = line.split(' ').slice(1).map(parseFloat);
                    uv_data[uv_index] = [u,v];
                }
            }
        };

        reader.onerror = () => {
            console.log("Error reading obj file");
        };

        reader.readAsText(file);

        return [vert_data, face_data, uv_data, mtl_filenames]
    }

}

module.exports = OBJHandler;