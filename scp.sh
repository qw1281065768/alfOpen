rm -f src.tar.gz
tar -zcvf src.tar.gz src
scp -i Qw7843251\!.pem src.tar.gz ec2-user@54.219.91.10:The-Weirdos-NFT-main/
