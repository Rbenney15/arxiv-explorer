/*
 * Renders one paper record as a table row.
 * The tr is the single root element — required by JSX.
 */
export default function PaperCard({ record }) {
  return (
    <tr className="paper-card">
      <td className="paper-id">
        <a
          href={`https://arxiv.org/abs/${record.id}`}
          target="_blank"
          rel="noreferrer"
        >
          {record.id}
        </a>
      </td>
      <td className="paper-date">{record.date}</td>
      <td className="paper-affiliation">{record.affiliation || "—"}</td>
      <td className="paper-subjects">
        {record.subjects.map((subject) => (
          <span
            key={subject}
            className={`subject-badge cat-${subject.split(".")[0]}`}
          >
            {subject}
          </span>
        ))}
      </td>
    </tr>
  );
}
