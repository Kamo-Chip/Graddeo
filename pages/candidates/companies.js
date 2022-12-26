export async function getStaticProps(context) {
  console.log(context);
return {
  props: {},
}
}

const CandidateCompaniesPage = () => {
  return (
    <div>
      <h1>Candidate Company Page</h1>
    </div>
  );
};

export default CandidateCompaniesPage;
