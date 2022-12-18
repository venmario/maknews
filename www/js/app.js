var $$ = Dom7;

var app = new Framework7({
  name: "MakNews", // App name
  theme: "auto", // Automatic theme detection
  el: "#app", // App root element

  // App store
  store: store,
  // App routes
  routes: routes,
});



const base_url = "http://ubaya.fun/hybrid/160419091/maknews";
const base_news_image = "http://ubaya.fun/hybrid/160419091/maknews/images/news";
const base_users_image = "http://ubaya.fun/hybrid/160419091/maknews/images/users";

function LoginLogout() {
  if (!localStorage.username) {
    app.view.main.router.navigate('/login', {
      reloadCurrent: false,
      pushState: false,
    });
    return;
  } else {
    localStorage.removeItem("username");
    app.view.main.router.navigate(app.view.main.router.currentRoute.url, {
      reloadCurrent: true,
      pushState: false,
    });
  }
}

app.request.post(base_url + "/selectberita.php", {}, function (data) {
  const arr = JSON.parse(data);
  if (arr["result"] == "success") {
    const arrnews = arr["arraynews"];
    arrnews.forEach((e) => {
      $$("#news-div").append(`
              <div class="card demo-facebook-card">
                <div class="card-header">
                  <div class="demo-facebook-name text-align-left">${e["news"]["judul"]}</div>
                  <div class="demo-facebook-date">Posted on ${e["news"]["created_at"]}</div>
                </div>
                <div class="card-content card-content-padding">
                  <img src="${base_news_image}/${e["gambar"][0]["idgambar"]}${e["gambar"][0]["extension"]}" width="100%" />
                  <p>${e["news"]["excerpt"]}</p>
                </div>
                <div class="card-footer text-align-center"><a href="/newsdetail/${e["news"]["idberita"]}" class="link display-inline-block">Read More</a></div>
              </div>
      `);
    });
  }
  $$("#news-div").append();
});
if (!localStorage.username) {
  $$('#hai_user').html(`Hai, Users!`);
  $$('#activity_login_logout').html("Login");
} else {
  $$('#hai_user').html(`Hai, ${localStorage.username}!`);
  $$('#activity_login_logout').html("Logout");
}
$$('body').on('click', '#btnprofile', function () {
  if (!localStorage.username) {
    app.view.main.router.navigate('/login', {
      reloadCurrent: false,
      pushState: false,
    });
  } else {
    app.view.main.router.navigate('/profile', {
      reloadCurrent: false,
      pushState: false,
    });
  }
})

$$(document).on("page:afterin", function (e, page) {
  if (page.name == "home") {
    if (!localStorage.username) {
      $$('#hai_user').html(`Hai, Users!`);
      $$('#activity_login_logout').html("Login");
    } else {
      $$('#hai_user').html(`Hai, ${localStorage.username}!`);
      $$('#activity_login_logout').html("Logout");
    }
  }
});
$$(document).on("page:init", function (e, page) {
  if (page.name == "home") {
    app.request.post(base_url + "/selectberita.php", {}, function (data) {
      const arr = JSON.parse(data);
      if (arr["result"] == "success") {
        const arrnews = arr["arraynews"];
        arrnews.forEach((e) => {
          $$("#news-div").append(`
                  <div class="card demo-facebook-card">
                    <div class="card-header">
                      <div class="demo-facebook-name text-align-left">${e["news"]["judul"]}</div>
                      <div class="demo-facebook-date">Posted on ${e["news"]["created_at"]}</div>
                    </div>
                    <div class="card-content card-content-padding">
                      <img src="${base_news_image}/${e["gambar"][0]["idgambar"]}${e["gambar"][0]["extension"]}" width="100%" />
                      <p>${e["news"]["excerpt"]}</p>
                    </div>
                    <div class="card-footer text-align-center"><a href="/newsdetail/${e["news"]["idberita"]}" class="link display-inline-block">Read More</a></div>
                  </div>
          `);
        });
      }
      $$("#news-div").append();
    });
    if (!localStorage.username) {
      $$('#hai_user').html(`Hai, Users!`);
      $$('#activity_login_logout').html("Login");
    } else {
      $$('#hai_user').html(`Hai, ${localStorage.username}!`);
      $$('#activity_login_logout').html("Logout");
    }
  } else if (page.name == "newsdetail") {
    const idberita = page.router.currentRoute.params.id;

    $$('#fab_comment').attr('href', `/comments/${idberita}`)

    app.request.post(base_url + "/detailberita.php", {
      idberita: idberita
    }, function (data) {
      const arrDetailBerita = JSON.parse(data);
      if (arrDetailBerita["result"] == "success") {
        const berita = arrDetailBerita["data"];
        $$("#news_title").html(berita["news"]["judul"]);
        $$("#news_release").html(berita["news"]["created_at"]);
        $$("#news_topic").html(berita["news"]["konten"]);
        $$("#news-image").attr("src", `${base_news_image}/${berita["gambar"][0]["idgambar"]}${berita["gambar"][0]["extension"]}`);
        var photos = [];
        berita["gambar"].forEach((e) => {
          photos.push(`${base_news_image}/${e["idgambar"]}${e["extension"]}`);
        });
        var myPhotoBrowserDark = app.photoBrowser.create({
          photos: photos,
          theme: "dark",
        });
        $$(".pb-standalone-dark").on("click", function () {
          myPhotoBrowserDark.open();
        });
      }
    });
  } else if (page.name == "profile") {
    $$('#btnlogout').on('click', function () {
      LoginLogout();
    });

    if (localStorage.username) {
      const username = localStorage.username
      app.request.post(base_url + "/getuser.php", {
        username: username
      }, function (data) {
        const arr = JSON.parse(data);
        if (arr['result'] == 'success') {
          $$('#image-profile').attr('src', `${base_users_image}/${arr['data']['gambar']}`);
          $$('#full_name').html(arr['data']['fullname']);
          $$('#fullnameprofile').val(arr['data']['fullname']);
          $$('#emailprofile').val(arr['data']['email']);
          $$('#phonenumberprofile').val(arr['data']['phonenumber']);
        }
      });
    }

    let profile_changed = false;
    let success_changed = false;
    $$('#change_profile_picture').on('click', function () {
      navigator.camera.getPicture(onSuccess, onFail, {
        quality: 100,
        targetWidth: 400,
        targetHeight: 400,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        encodingType: Camera.EncodingType.JPEG,
        mediaType: Camera.MediaType.PICTURE,
        correctOrientation: true,
      });

      function onSuccess(imageData) {
        $$("#image-profile").attr("src", "data:image/jpeg;base64," + imageData);
        profile_changed = true;
        // app.dialog.alert("success upload");
      }

      function onFail(message) {
        app.dialog.alert("Failed because: " + message);
      }
    });


    $$('#btneditprofile').on('click', function () {
      if (profile_changed) {
        const imgUri = $$("#image-profile").attr("src");
        var options = new FileUploadOptions();
        options.fileKey = "photo";
        options.fileName = imgUri.substr(imgUri.lastIndexOf("/") + 1);
        options.mimeType = "image/jpeg";
        options.params = {
          username: localStorage.username,
        };

        var ft = new FileTransfer();
        ft.upload(
          imgUri,
          encodeURI(base_url + "/uploadprofilepicture.php"),
          function (result) {
            // success_changed = true;
          },
          function (error) {
            // success_changed = false;
          },
          options
        );
        profile_changed = false;
      }
      const username = localStorage.username;
      const fullname = $$('#fullnameprofile').val();
      const email = $$('#emailprofile').val();
      const phonenumber = $$('#phonenumberprofile').val();
      app.request.post(base_url + "/updateprofile.php", {
        username: username,
        fullname: fullname,
        email: email,
        phonenumber: phonenumber
      }, function (data) {
        const arr = JSON.parse(data);
        if (arr["result"] == "success") {
          app.dialog.alert('Sukses update profile!', function () {
            app.view.main.router.navigate(app.view.main.router.currentRoute.url, {
              reloadCurrent: true,
              pushState: false,
            });
          })
        } else app.dialog.alert("Gagal update profile!");
      });
    });
  } else if (page.name == "login") {
    $$('#btnsignin').on('click', function () {
      const username = $$("#username").val();
      const password = $$("#password").val();

      app.request.post(base_url + "/login.php", {
        username: username,
        password: password
      }, function (data) {
        const arr = JSON.parse(data);
        if (arr["result"] == "success") {
          localStorage.username = username;
          page.router.back("/");
        } else app.dialog.alert("Username atau password salah");
      })
    })
  } else if (page.name == "register") {
    $$("#btnsignup").on('click', function () {
      const username = $$("#usernameregis").val();
      const fullname = $$("#fullname").val();
      const password = $$("#passwordregis").val();
      const email = $$("#email").val();
      const phonenumber = $$("#phonenumber").val();

      app.request.post(base_url + "/register.php", {
        username: username,
        password: password,
        fullname: fullname,
        email: email,
        phonenumber: phonenumber
      }, function (data) {
        const arr = JSON.parse(data);
        if (arr["result"] == "success") {
          app.dialog.alert('Silahkan login', 'Sukses Registrasi!', function () {
            page.router.back("/login");
          });
        } else app.dialog.alert(arr['message']);
      });
    });
  } else if (page.name == "comments") {
    const id = page.router.currentRoute.params.id;

    app.request.post(base_url + "/getcomments.php", {
      idberita: id
    }, function (data) {
      const arr = JSON.parse(data);
      if (arr['result'] == "success") {
        $$('#news_commen_title').html(arr['newstitle']['judul']);
        const comments = arr['comments'];
        comments.forEach(e => {
          if (e['username'] == localStorage.username) {
            $$('#pesan').append(`<div class="pesan-mengirim display-flex justify-content-right ">
                                    <div class="profile-wrapper display-flex flex-direction-column align-items-flex-end">
                                      <div class="profile-name display-flex align-items-center">${e['fullname']}</div>
                                      <div class="bg-color-black text-color-white pesan-konten-wrapper rounded-1">
                                        <p class="no-padding no-margin">${e['konten']}</p>
                                        <div class="display-flex justify-content-space-between">
                                          <div class="release-comment display-flex align-items-center text-color-gray">${e['created_at']}</div>
                                          <div class="delete-comment"><a data-id="${e['idkomentar']}" id="btnhapuskomen" href="#" class="color-red"><i
                                                class="f7-icons">trash_circle_fill</i></a>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <img class="profile-pesan rounded-circle " src="${base_users_image}/${e['gambar']}" alt="">
                                  </div>`);
          } else {
            $$("#pesan").append(`<div class="pesan-diterima display-flex">
                                      <img class="profile-pesan rounded-circle " src="${base_users_image}/${e['gambar']}" alt="">
                                      <div class="profile-wrapper">
                                        <div class="profile-name display-flex align-items-center">${e['fullname']}</div>
                                        <div class="pesan-konten-wrapper rounded-1 bg-color-gray">
                                          <p class="no-margin no-padding">${e['konten']}</p>
                                          <div class="release-comment text-align-right text-color-white">${e['created_at']}</div>
                                        </div>
                                      </div>
                                    </div>`);
          }

        });
      }
    });

    $$('body').on('click', '#btnhapuskomen', function () {
      const idkomentar = $$(this).data('id');
      app.dialog.confirm("Are you sure want to delete this comment?", "WARNING!", function () {
        app.request.post(base_url + "/deletecomment.php", {
          idkomentar: idkomentar
        }, function (data) {
          const arr = data;
          if (arr['result'] == "failed") {
            app.dialog.alert(arr['message']);
          } else {
            app.view.main.router.navigate(app.view.main.router.currentRoute.url, {
              reloadCurrent: true,
              pushState: false,
            });
          }
        });
      })
    })


    $$('#kirim_komentar').on('click', function () {
      if (!localStorage.username) {
        app.view.main.router.navigate('/login', {
          reloadCurrent: false,
          pushState: false,
        });
        return;
      }
      const konten = $$('#komentar_input').val();
      if (konten.length === 0) return;
      app.request.post(
        base_url + "/insertcomment.php", {
          idberita: id,
          username: localStorage.username,
          konten: konten
        },
        function (data) {
          const arr = data;
          if (arr['result'] == "failed") {
            app.dialog.alert(arr['message']);
          } else {
            app.view.main.router.navigate(app.view.main.router.currentRoute.url, {
              reloadCurrent: true,
              pushState: false,
            });
          }
        }
      )
    })

  } else if (page.name == "category") {
    idjenis = page.router.currentRoute.params.id;
    app.request.post(base_url + "/selectberita.php", {
      idjenis: idjenis
    }, function (data) {
      const arr = JSON.parse(data);
      if (arr["result"] == "success") {
        console.log(arr);
        const arrnews = arr["arraynews"];
        const jenisberita = arr['news_category'][0]['nama'];
        $$('#kategori_berita').html(jenisberita.toUpperCase());
        arrnews.forEach((e) => {
          $$("#news-div").append(`
                  <div class="card demo-facebook-card">
                    <div class="card-header">
                      <div class="demo-facebook-name text-align-left">${e["news"]["judul"]}</div>
                      <div class="demo-facebook-date">Posted on ${e["news"]["created_at"]}</div>
                    </div>
                    <div class="card-content card-content-padding">
                      <img src="${base_news_image}/${e["gambar"][0]["idgambar"]}${e["gambar"][0]["extension"]}" width="100%" />
                      <p>${e["news"]["excerpt"]}</p>
                    </div>
                    <div class="card-footer text-align-center"><a href="/newsdetail/${e["news"]["idberita"]}" class="link display-inline-block">Read More</a></div>
                  </div>
          `);
        });
      }
      $$("#news-div").append();
    });
  }
});