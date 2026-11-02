# Quote form Lambda

Receives the website quote form (JSON POST) and emails it via Amazon SES.

1. Verify the sender and recipient addresses (or the domain) in SES, same region as the Lambda.
2. Create a Python 3.13 Lambda with `handler.handler`, env vars `TO_EMAIL` and `FROM_EMAIL`, and an
   execution role allowed `ses:SendEmail`.
3. Add a Function URL (auth NONE) with CORS: allowed origin `https://www.a2zautodismantlers.nz`
   (plus the Amplify preview domain while testing), methods `POST`, header `content-type`.
   CORS lives only here: the handler never sets CORS headers.
4. Set `NEXT_PUBLIC_QUOTE_ENDPOINT` to the Function URL in Amplify environment variables and redeploy.

Tests: `pip install pytest && pytest infra/lambda/quote-form` (boto3 is stubbed).
