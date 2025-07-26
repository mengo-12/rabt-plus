'use client';
import { useEffect, useState } from 'react';

export default function ProjectsList() {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        fetch('/api/projects')
            .then((res) => res.json())
            .then((data) => setProjects(data));
    }, []);

    return (
        <div className="max-w-4xl mx-auto mt-10">
            <h2 className="text-2xl font-bold mb-6">المشاريع المتاحة</h2>
            <div className="grid gap-4">
                {projects.map((project) => (
                    <div key={project.id} className="p-4 bg-white dark:bg-gray-800 shadow rounded">
                        <h3 className="text-lg font-bold">{project.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300">{project.description}</p>
                        {project.budget && (
                            <p className="text-sm text-gray-500 mt-2">الميزانية: {project.budget} ريال</p>
                        )}
                        <a
                            href={`/dashboard/freelancer/projects/${project.id}`}
                            className="text-blue-600 mt-3 inline-block hover:underline"
                        >
                            تفاصيل المشروع
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}
