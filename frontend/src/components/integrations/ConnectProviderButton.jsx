export default function ConnectProviderButton({ provider, onConnect }) {
  return <button onClick={onConnect}>Connect {provider}</button>;
}
