export default class OBJHandler {

    async createFile(path, filename, type) {
        let response = await fetch(path);
        let data = await response.blob();
        return new File([data], filename, { type });
    }

    async readObjFile(file) {
        let objects = {};
        let vertex_data = {};
        let face_data = { "vertices": {}, "uvs": {}, "normals": {} };
        let uv_data = {};
        let normal_data = {};
        let mtllib = [];
        let usemtl = [];
        let vert_count = 0;
        let tri_count = 0;
        let current_object = '';
        const file_content = await file.text();

        try {
            let vert_index = 0;
            let face_index = 0;
            let uv_index = 0;
            let normal_index = 0;
            const lines = file_content.split('\n');

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();

                if (! line) {
                    continue;
                }

                if (line.startsWith('o ')) {
                    current_object = line.split(' ')[1];
                    vertex_data = {};
                    face_data = { "vertices": {}, "uvs": {}, "normals": {} };
                    uv_data = {};
                    normal_data = {};
                    // TODO When to do this? Is it even necessary? And what about usemtl?
                    // mtllib = [];
                    usemtl = [];
                }

                if (line.startsWith('mtllib ')) {
                    mtllib.push(line.split(' ')[1]);
                }

                if (line.startsWith('usemtl ')) {
                    usemtl.push(line.split(' ')[1]);
                }

                if (line.startsWith('v ')) {
                    vert_index++;
                    let [x, y, z] = line.split(' ').slice(1).map(parseFloat);
                    vertex_data[vert_index] = [x,y,z];
                    vert_count++;
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
                    face_data.normals[face_index] = line.split(' ')
                        .slice(1)
                        .map((value) => {
                            return value.split('/').slice(2,3).map(parseFloat)[0];
                        });
                    tri_count++;
                }

                if (line.startsWith('vt ')) {
                    uv_index++;
                    let [u,v] = line.split(' ').slice(1).map(parseFloat);
                    uv_data[uv_index] = [u,v];
                }

                if (line.startsWith('vn ')) {
                    normal_index++;
                    let [x,y,z] = line.split(' ').slice(1).map(parseFloat);
                    normal_data[normal_index] = [x,y,z];
                }

                if (current_object) {
                    objects[current_object] = {
                        "v": vertex_data,
                        "f": face_data,
                        "vt": uv_data,
                        "vn": normal_data,
                        "mtllib": mtllib,
                        "usemtl": usemtl,
                    };
                }
            }
        } catch (e) {
            console.log("Error reading obj file", e);
        }

        return [objects, vert_count, tri_count];
    }

    async readMtlFile(file, usemtl) {
        let texture_map = '';
        let current_mtl = '';
        const file_content = await file.text();

        try {
            const lines = file_content.split('\n');

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();

                if (!line) {
                    continue;
                }

                if (line.startsWith('newmtl')) {
                    current_mtl = line.split(' ')[1];
                }

                if (line.startsWith('map_Kd') && current_mtl === usemtl) {
                    texture_map = line.split(' ')[1];
                }
            }
        } catch(e) {
            console.log('Error reading mtl file', e);
        }

        return texture_map;
    }

}
