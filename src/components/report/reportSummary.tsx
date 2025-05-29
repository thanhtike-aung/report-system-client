import React from "react";

interface Task {
  title: string;
  description: string;
}

interface Report {
  project: string;
  tasks: Task[];
}

interface ReportSummaryProps {
  content: string;
}

const ReportSummary: React.FC<ReportSummaryProps> = ({ content }) => {
  const parseContent = (content: string) => {
    try {
      const match = content.match(/```json\s*([\s\S]*?)```/);
      const jsonStr = match ? match[1].trim() : content;
      const data = JSON.parse(jsonStr);
      return data.reports || [];
    } catch (error) {
      console.error("Failed to parse report content:", error);
      return [];
    }
  };

  const reports = parseContent(content);

  return (
    <div className="space-y-6 p-4">
      {reports.map((report: Report, index: number) => (
        <div key={index} className="rounded-lg border p-4 bg-card">
          <h3 className="text-lg font-semibold mb-3 text-primary">
            {report.project}
          </h3>
          <div className="space-y-3">
            {report.tasks.map((task: Task, taskIndex: number) => (
              <div key={taskIndex} className="pl-4 border-l-2 border-muted">
                <h4 className="font-medium text-sm">{task.title}</h4>
                {task.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {task.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReportSummary;
