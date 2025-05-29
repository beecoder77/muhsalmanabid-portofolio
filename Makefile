.PHONY: deploy

deploy:
	git pull origin main
	pnpm install
	pnpm build
	sudo cp -r .next/* /var/www/muhsalmanabid.tech
	pm2 restart muhsalmanabid-portofolio 