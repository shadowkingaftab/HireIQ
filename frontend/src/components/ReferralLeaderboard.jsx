export default function ReferralLeaderboard({ referrals = [] }) {
  return (
    <div>
      <h3>Referral Leaderboard</h3>
      <ol>
        {referrals.map((item) => <li key={item.id}>{item.name}: {item.count}</li>)}
      </ol>
    </div>
  );
}
