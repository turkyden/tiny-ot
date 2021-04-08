
import ReconnectingWebSocket from 'reconnecting-websocket';
import { Connection, Doc } from 'sharedb/lib/client';
import { useEffect, useRef, useState } from 'react';



export default function A() {
  const ref = useRef<Doc<any>>();

  const [count, setCount] = useState(0);

  const onClick = () => ref.current?.submitOp([{p: ['counter'], na: 1}]);

  useEffect(() => {
    const port = parseInt(process.env.PORT || '3000', 10);
    const host = window.location.host;
    const socket = new ReconnectingWebSocket(`wss://${host}:${port}`);
    const connection = new Connection(socket as any);
    ref.current = connection.get('doc-collection', 'doc-id');

    ref.current.subscribe((error) => {
      if (error) return console.error(error)

      // If doc.type is undefined, the document has not been created, so let's create it
      if (!ref.current?.type) {
        ref.current?.create({counter: 0}, (error: any) => {
          if (error) console.error(error)
        })
      }
    });

    ref.current.on('op', (op: any) => {
      setCount(ref.current?.data.counter);
      console.log(op);
    })

    return () => {
      // todo
    }
  }, [ref])

  return (
    <div>
      <button onClick={onClick}>Increment the counter by 1</button>
      <p>{count}</p>
    </div>
  )
}
