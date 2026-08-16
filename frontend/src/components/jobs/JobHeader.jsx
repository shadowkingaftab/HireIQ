export default function JobHeader({ job }) {
  return (
    <header style={{ marginBottom: 16 }}>
      <h1>{job?.title || "Job"}</h1>
      <p>{job?.description}</p>
      <div>{job?.location}</div>
    </header>
  );
}
