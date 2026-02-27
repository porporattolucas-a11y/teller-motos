import React, { useState, useEffect } from "react";

export default function App() {
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem("moto_projects");
    return saved ? JSON.parse(saved) : [];
  });

  const [newProject, setNewProject] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [newPart, setNewPart] = useState({
    code: "",
    name: "",
    material: "",
    process: "",
    status: "En diseño",
    suggestion: "",
  });

  useEffect(() => {
    localStorage.setItem("moto_projects", JSON.stringify(projects));
  }, [projects]);

  const createProject = () => {
    if (!newProject.trim()) return;
    const project = {
      id: Date.now(),
      name: newProject,
      parts: [],
      createdAt: new Date().toLocaleDateString(),
    };
    setProjects([...projects, project]);
    setNewProject("");
  };

  const addPart = () => {
    if (!selectedProject || !newPart.code || !newPart.name) return;

    const updatedProjects = projects.map((p) => {
      if (p.id === selectedProject.id) {
        return {
          ...p,
          parts: [
            ...p.parts,
            {
              id: Date.now(),
              ...newPart,
              version: "V1",
              files: [],
            },
          ],
        };
      }
      return p;
    });

    setProjects(updatedProjects);
    setNewPart({
      code: "",
      name: "",
      material: "",
      process: "",
      status: "En diseño",
      suggestion: "",
    });
  };

  const updateStatus = (projectId, partId, status) => {
    const updated = projects.map((p) => {
      if (p.id === projectId) {
        return {
          ...p,
          parts: p.parts.map((part) =>
            part.id === partId ? { ...part, status } : part
          ),
        };
      }
      return p;
    });
    setProjects(updated);
  };

  const updateSuggestion = (projectId, partId, suggestion) => {
    const updated = projects.map((p) => {
      if (p.id === projectId) {
        return {
          ...p,
          parts: p.parts.map((part) =>
            part.id === partId ? { ...part, suggestion } : part
          ),
        };
      }
      return p;
    });
    setProjects(updated);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6", padding: 16 }}>
      <h1 style={{ fontSize: 28, fontWeight: "bold", marginBottom: 16 }}>
        Seguimiento de Proyectos - Autopartes Moto (Taller)
      </h1>

      <div style={{ background: "white", padding: 16, borderRadius: 12, marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: "600", marginBottom: 8 }}>
          Crear Nuevo Proyecto
        </h2>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            style={{ padding: 8, width: "100%" }}
            placeholder="Ej: Soporte tablero Yamaha R3"
            value={newProject}
            onChange={(e) => setNewProject(e.target.value)}
          />
          <button onClick={createProject} style={{ padding: "8px 16px" }}>
            Crear
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16 }}>
        <div style={{ background: "white", padding: 16, borderRadius: 12 }}>
          <h2 style={{ fontSize: 20, fontWeight: "600", marginBottom: 12 }}>
            Proyectos Activos
          </h2>
          {projects.map((project) => (
            <div
              key={project.id}
              style={{
                padding: 12,
                marginBottom: 8,
                borderRadius: 8,
                cursor: "pointer",
                background:
                  selectedProject?.id === project.id ? "#dbeafe" : "#f9fafb",
              }}
              onClick={() => setSelectedProject(project)}
            >
              <strong>{project.name}</strong>
              <div>Piezas: {project.parts.length}</div>
            </div>
          ))}
        </div>

        <div style={{ background: "white", padding: 16, borderRadius: 12 }}>
          {!selectedProject ? (
            <p>Seleccioná un proyecto para ver y gestionar las piezas.</p>
          ) : (
            <>
              <h2 style={{ fontSize: 20, fontWeight: "600", marginBottom: 12 }}>
                Proyecto: {selectedProject.name}
              </h2>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, marginBottom: 16 }}>
                <input
                  placeholder="Código pieza"
                  value={newPart.code}
                  onChange={(e) => setNewPart({ ...newPart, code: e.target.value })}
                />
                <input
                  placeholder="Nombre pieza"
                  value={newPart.name}
                  onChange={(e) => setNewPart({ ...newPart, name: e.target.value })}
                />
                <input
                  placeholder="Material"
                  value={newPart.material}
                  onChange={(e) => setNewPart({ ...newPart, material: e.target.value })}
                />
                <input
                  placeholder="Proceso (3D, CNC, Chapa)"
                  value={newPart.process}
                  onChange={(e) => setNewPart({ ...newPart, process: e.target.value })}
                />
                <button onClick={addPart}>Agregar Pieza</button>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#e5e7eb" }}>
                      <th>Código</th>
                      <th>Pieza</th>
                      <th>Material</th>
                      <th>Proceso</th>
                      <th>Estado (Taller)</th>
                      <th>Sugerencias del Taller</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects
                      .find((p) => p.id === selectedProject.id)
                      ?.parts.map((part) => (
                        <tr key={part.id} style={{ borderTop: "1px solid #ddd" }}>
                          <td>{part.code}</td>
                          <td>{part.name}</td>
                          <td>{part.material}</td>
                          <td>{part.process}</td>
                          <td>
                            <select
                              value={part.status}
                              onChange={(e) =>
                                updateStatus(selectedProject.id, part.id, e.target.value)
                              }
                            >
                              <option>En diseño</option>
                              <option>En prototipo 3D</option>
                              <option>Prueba en moto</option>
                              <option>Corrección solicitada</option>
                              <option>Listo para fabricación</option>
                              <option>Finalizado</option>
                            </select>
                          </td>
                          <td>
                            <input
                              placeholder="Ej: ajustar espesor / interferencia con chasis"
                              value={part.suggestion || ""}
                              onChange={(e) =>
                                updateSuggestion(selectedProject.id, part.id, e.target.value)
                              }
                            />
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}